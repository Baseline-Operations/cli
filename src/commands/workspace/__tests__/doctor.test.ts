/**
 * Tests for workspace doctor command wrapper.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { doctorCommand } from "../doctor";
import * as coreCommands from "@baseline/core/commands";
import { Logger } from "../../../utils/logger";

// Mock dependencies
vi.mock("@baseline/core/commands", () => ({
	doctorCheck: vi.fn(),
}));

vi.mock("../../../utils/logger", () => ({
	Logger: {
		title: vi.fn(),
		success: vi.fn(),
		error: vi.fn(),
		info: vi.fn(),
		warn: vi.fn(),
	},
}));

describe("doctorCommand", () => {
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

	it("should call core doctorCheck and display messages", async () => {
		vi.mocked(coreCommands.doctorCheck).mockResolvedValue({
			success: true,
			messages: [
				{ type: "info", message: "Doctor Check", category: "title" },
				{ type: "success", message: "All checks passed" },
			],
		});

		await doctorCommand({});

		expect(coreCommands.doctorCheck).toHaveBeenCalledWith({});
		expect(Logger.title).toHaveBeenCalledWith("Doctor Check");
		expect(Logger.success).toHaveBeenCalledWith("All checks passed");
		expect(exitSpy).toHaveBeenCalledWith(0);
	});

	it("should handle errors and exit with code 1", async () => {
		vi.mocked(coreCommands.doctorCheck).mockResolvedValue({
			success: false,
			messages: [{ type: "error", message: "Check failed" }],
		});

		await doctorCommand({});

		expect(Logger.error).toHaveBeenCalledWith("Check failed");
		expect(exitSpy).toHaveBeenCalledWith(1);
	});
});
