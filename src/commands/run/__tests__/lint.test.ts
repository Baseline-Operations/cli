/**
 * Tests for run lint command wrapper.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { lintCommand } from "../lint";
import * as coreCommands from "@baseline/core/commands";
import { Logger } from "../../../utils/logger";

// Mock dependencies
vi.mock("@baseline/core/commands", () => ({
	runLint: vi.fn(),
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

describe("lintCommand", () => {
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

	it("should call core runLint and display messages", async () => {
		vi.mocked(coreCommands.runLint).mockResolvedValue({
			success: true,
			succeeded: 0,
			failed: 0,
			skipped: 0,
			messages: [
				{ type: "info", message: "Running Linters" },
				{ type: "success", message: "All linters passed" },
			],
		});

		await lintCommand({});

		expect(coreCommands.runLint).toHaveBeenCalledWith({});
		expect(Logger.title).toHaveBeenCalledWith("Running Linters");
		expect(Logger.success).toHaveBeenCalledWith("All linters passed");
		expect(exitSpy).not.toHaveBeenCalled();
	});

	it("should pass filter to core command", async () => {
		vi.mocked(coreCommands.runLint).mockResolvedValue({
			success: true,
			succeeded: 0,
			failed: 0,
			skipped: 0,
			messages: [],
		});

		await lintCommand({ filter: "my-package" });

		expect(coreCommands.runLint).toHaveBeenCalledWith({
			filter: "my-package",
		});
	});

	it("should handle errors and exit with code 1", async () => {
		vi.mocked(coreCommands.runLint).mockResolvedValue({
			success: false,
			succeeded: 0,
			failed: 1,
			skipped: 0,
			messages: [{ type: "error", message: "Linting failed" }],
		});

		await lintCommand({});

		expect(Logger.error).toHaveBeenCalledWith("Linting failed");
		expect(exitSpy).toHaveBeenCalledWith(1);
	});
});
