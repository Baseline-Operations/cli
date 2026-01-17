/**
 * Tests for run start command wrapper.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { startCommand } from "../start";
import * as coreCommands from "@baseline/core/commands";
import { Logger } from "../../../utils/logger";

// Mock dependencies
vi.mock("@baseline/core/commands", () => ({
	startApplications: vi.fn(),
}));

vi.mock("../../../utils/logger", () => ({
	Logger: {
		title: vi.fn(),
		success: vi.fn(),
		error: vi.fn(),
		info: vi.fn(),
		warn: vi.fn(),
		dim: vi.fn(),
	},
}));

describe("startCommand", () => {
	let originalExit: typeof process.exit;
	let exitSpy: any;

	beforeEach(() => {
		vi.clearAllMocks();

		// Mock process.exit
		originalExit = process.exit;
		exitSpy = vi.fn();
		process.exit = exitSpy as any;
	});

	afterEach(() => {
		process.exit = originalExit;
		vi.restoreAllMocks();
	});

	it("should call core startApplications and display messages", async () => {
		vi.mocked(coreCommands.startApplications).mockResolvedValue({
			success: true,
			succeeded: 0,
			failed: 0,
			skipped: 0,
			messages: [
				{ type: "info", message: "Starting Applications" },
				{ type: "success", message: "Applications started successfully" },
			],
		});

		await startCommand({});

		expect(coreCommands.startApplications).toHaveBeenCalledWith({});
		expect(Logger.title).toHaveBeenCalledWith("Starting Applications");
		expect(Logger.success).toHaveBeenCalledWith("Applications started successfully");
	});

	it("should pass options to core command", async () => {
		vi.mocked(coreCommands.startApplications).mockResolvedValue({
			success: true,
			succeeded: 0,
			failed: 0,
			skipped: 0,
			messages: [],
		});

		const options = { filter: "my-package" };
		await startCommand(options);

		expect(coreCommands.startApplications).toHaveBeenCalledWith(options);
	});

	it("should handle errors and exit with code 1", async () => {
		vi.mocked(coreCommands.startApplications).mockResolvedValue({
			success: false,
			succeeded: 0,
			failed: 1,
			skipped: 0,
			messages: [{ type: "error", message: "Failed to start applications" }],
		});

		await startCommand({});

		expect(Logger.error).toHaveBeenCalledWith("Failed to start applications");
		expect(exitSpy).toHaveBeenCalledWith(1);
	});
});
