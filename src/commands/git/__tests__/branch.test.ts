/**
 * Tests for git branch command wrapper.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { branchCommand } from "../branch";
import * as coreCommands from "@baseline/core/commands";
import { Logger } from "../../../utils/logger";

// Mock dependencies
vi.mock("@baseline/core/commands", () => ({
	branchRepositories: vi.fn(),
}));

vi.mock("../../../utils/logger", () => ({
	Logger: {
		title: vi.fn(),
		success: vi.fn(),
		error: vi.fn(),
		info: vi.fn(),
		warn: vi.fn(),
		log: vi.fn(),
	},
}));

describe("branchCommand", () => {
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

	it("should call core branchRepositories and display messages", async () => {
		vi.mocked(coreCommands.branchRepositories).mockResolvedValue({
			success: true,
			succeeded: 0,
			failed: 0,
			skipped: 0,
			messages: [
				{ type: "info", message: "Creating branch: feature/new-feature" },
				{ type: "success", message: "Branch created successfully" },
			],
		});

		await branchCommand("feature/new-feature", { create: true });

		expect(coreCommands.branchRepositories).toHaveBeenCalledWith(
			"feature/new-feature",
			{ create: true }
		);
		expect(Logger.title).toHaveBeenCalledWith("Creating branch: feature/new-feature");
		expect(Logger.success).toHaveBeenCalledWith("Branch created successfully");
	});

	it("should handle errors and exit with code 1", async () => {
		vi.mocked(coreCommands.branchRepositories).mockResolvedValue({
			success: false,
			succeeded: 0,
			failed: 1,
			skipped: 0,
			messages: [{ type: "error", message: "Failed to create branch" }],
		});

		await branchCommand("feature/new-feature", { create: true });

		expect(Logger.error).toHaveBeenCalledWith("Failed to create branch");
		expect(exitSpy).toHaveBeenCalledWith(1);
	});
});
