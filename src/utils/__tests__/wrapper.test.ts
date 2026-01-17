/**
 * Tests for wrapCommand utility.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { wrapCommand } from "../wrapper";
import type { BaseResult } from "@baseline/core/types";
import { createSpinner, stopSpinner, succeedSpinner, failSpinner } from "../progress";
import { Logger } from "../logger";

// Mock dependencies
vi.mock("../progress", () => ({
	createSpinner: vi.fn(),
	stopSpinner: vi.fn(),
	succeedSpinner: vi.fn(),
	failSpinner: vi.fn(),
}));

vi.mock("../logger", () => ({
	Logger: {
		title: vi.fn(),
		info: vi.fn(),
		success: vi.fn(),
		error: vi.fn(),
		warn: vi.fn(),
		dim: vi.fn(),
	},
}));

describe("wrapCommand", () => {
	let mockSpinner: any;
	let exitSpy: any;
	let originalExit: typeof process.exit;

	beforeEach(() => {
		// Reset mocks
		vi.clearAllMocks();

		// Mock spinner
		mockSpinner = {
			stop: vi.fn(),
			succeed: vi.fn(),
			fail: vi.fn(),
			text: "",
		};

		vi.mocked(createSpinner).mockReturnValue(mockSpinner as any);
		vi.mocked(stopSpinner).mockImplementation(() => {});
		vi.mocked(succeedSpinner).mockImplementation(() => {});
		vi.mocked(failSpinner).mockImplementation(() => {});

		// Mock logger
		vi.mocked(Logger.title).mockImplementation(() => {});
		vi.mocked(Logger.info).mockImplementation(() => {});
		vi.mocked(Logger.success).mockImplementation(() => {});
		vi.mocked(Logger.error).mockImplementation(() => {});
		vi.mocked(Logger.warn).mockImplementation(() => {});
		vi.mocked(Logger.dim).mockImplementation(() => {});

		// Mock process.exit
		originalExit = process.exit;
		exitSpy = vi.fn();
		process.exit = exitSpy as any;
	});

	afterEach(() => {
		process.exit = originalExit;
	});

	it("should display spinner and succeed when command succeeds without messages", async () => {
		const command = vi.fn().mockResolvedValue({
			success: true,
			messages: undefined,
		} as BaseResult);

		await wrapCommand("Test Command", command);

		expect(createSpinner).toHaveBeenCalledWith("Test Command");
		expect(command).toHaveBeenCalled();
		expect(succeedSpinner).toHaveBeenCalledWith(mockSpinner);
		expect(exitSpy).not.toHaveBeenCalled();
	});

	it("should display messages and succeed when command succeeds with messages", async () => {
		const command = vi.fn().mockResolvedValue({
			success: true,
			messages: [
				{ type: "info", message: "Info message" },
				{ type: "success", message: "Success message" },
			],
		} as BaseResult);

		await wrapCommand("Test Command", command);

		expect(stopSpinner).toHaveBeenCalledWith(mockSpinner);
		expect(Logger.title).toHaveBeenCalledWith("Test Command");
		expect(Logger.info).toHaveBeenCalledWith("Info message");
		expect(Logger.success).toHaveBeenCalledWith("Success message");
		expect(succeedSpinner).not.toHaveBeenCalled();
		expect(exitSpy).not.toHaveBeenCalled();
	});

	it("should display error messages and exit when command fails", async () => {
		const command = vi.fn().mockResolvedValue({
			success: false,
			messages: [
				{ type: "error", message: "Error message", suggestion: "Try again" },
			],
		} as BaseResult);

		await wrapCommand("Test Command", command);

		expect(stopSpinner).toHaveBeenCalledWith(mockSpinner);
		expect(Logger.error).toHaveBeenCalledWith("Error message");
		expect(Logger.info).toHaveBeenCalledWith("💡 Try again");
		expect(exitSpy).toHaveBeenCalledWith(1);
	});

	it("should fail spinner and exit when command fails without messages", async () => {
		const command = vi.fn().mockResolvedValue({
			success: false,
			messages: undefined,
		} as BaseResult);

		await wrapCommand("Test Command", command);

		expect(failSpinner).toHaveBeenCalledWith(mockSpinner, "Failed");
		expect(exitSpy).toHaveBeenCalledWith(1);
	});

	it("should handle all message types correctly", async () => {
		const command = vi.fn().mockResolvedValue({
			success: true,
			messages: [
				{ type: "info", message: "Info" },
				{ type: "success", message: "Success" },
				{ type: "error", message: "Error" },
				{ type: "warn", message: "Warning" },
				{ type: "dim", message: "Dim" },
			],
		} as BaseResult);

		await wrapCommand("Test Command", command);

		expect(Logger.info).toHaveBeenCalledWith("Info");
		expect(Logger.success).toHaveBeenCalledWith("Success");
		expect(Logger.error).toHaveBeenCalledWith("Error");
		expect(Logger.warn).toHaveBeenCalledWith("Warning");
		expect(Logger.dim).toHaveBeenCalledWith("Dim");
	});

	it("should handle title messages (Summary, Repository Status, Dependency Graph)", async () => {
		const command = vi.fn().mockResolvedValue({
			success: true,
			messages: [
				{ type: "info", message: "Summary of operations" },
				{ type: "info", message: "Repository Status" },
				{ type: "info", message: "Dependency Graph" },
			],
		} as BaseResult);

		await wrapCommand("Test Command", command);

		expect(Logger.title).toHaveBeenCalledWith("Summary of operations");
		expect(Logger.title).toHaveBeenCalledWith("Repository Status");
		expect(Logger.title).toHaveBeenCalledWith("Dependency Graph");
		expect(Logger.info).not.toHaveBeenCalledWith("Summary of operations");
	});

	it("should handle thrown errors", async () => {
		const error = new Error("Command failed");
		const command = vi.fn().mockRejectedValue(error);

		await wrapCommand("Test Command", command);

		expect(failSpinner).toHaveBeenCalledWith(mockSpinner, "Failed");
		expect(Logger.error).toHaveBeenCalledWith("Failed: Command failed");
		expect(exitSpy).toHaveBeenCalledWith(1);
	});

	it("should handle non-Error thrown values", async () => {
		const command = vi.fn().mockRejectedValue("String error");

		await wrapCommand("Test Command", command);

		expect(failSpinner).toHaveBeenCalledWith(mockSpinner, "Failed");
		expect(Logger.error).toHaveBeenCalledWith("Failed: String error");
		expect(exitSpy).toHaveBeenCalledWith(1);
	});
});
