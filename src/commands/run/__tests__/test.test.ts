/**
 * Tests for run test command wrapper.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { testCommand } from "../test";
import * as coreCommands from "@baseline/core/commands";
import { Logger } from "../../../utils/logger";

// Mock dependencies
vi.mock("@baseline/core/commands", () => ({
	runTests: vi.fn(),
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

describe("testCommand", () => {
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

	it("should call core runTests and display messages", async () => {
		vi.mocked(coreCommands.runTests).mockResolvedValue({
			success: true,
			succeeded: 0,
			failed: 0,
			skipped: 0,
			messages: [
				{ type: "info", message: "Running Tests" },
				{ type: "success", message: "All tests passed" },
			],
		});

		await testCommand({});

		expect(coreCommands.runTests).toHaveBeenCalledWith({});
		expect(Logger.title).toHaveBeenCalledWith("Running Tests");
		expect(Logger.success).toHaveBeenCalledWith("All tests passed");
		expect(exitSpy).not.toHaveBeenCalled();
	});

	it("should pass filter to core command", async () => {
		vi.mocked(coreCommands.runTests).mockResolvedValue({
			success: true,
			succeeded: 0,
			failed: 0,
			skipped: 0,
			messages: [],
		});

		await testCommand({ filter: "my-package" });

		expect(coreCommands.runTests).toHaveBeenCalledWith({
			filter: "my-package",
		});
	});

	it("should handle errors and exit with code 1", async () => {
		vi.mocked(coreCommands.runTests).mockResolvedValue({
			success: false,
			succeeded: 0,
			failed: 1,
			skipped: 0,
			messages: [{ type: "error", message: "Tests failed" }],
		});

		await testCommand({});

		expect(Logger.error).toHaveBeenCalledWith("Tests failed");
		expect(exitSpy).toHaveBeenCalledWith(1);
	});
});
