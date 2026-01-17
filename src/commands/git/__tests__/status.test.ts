/**
 * Tests for git status command wrapper.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { statusCommand } from "../status";
import * as coreCommands from "@baseline/core/commands";
import { Logger } from "../../../utils/logger";

// Mock dependencies
vi.mock("@baseline/core/commands", () => ({
	getRepositoryStatus: vi.fn(),
}));

vi.mock("chalk", () => ({
	default: {
		gray: (s: string) => s,
		red: (s: string) => s,
		green: (s: string) => s,
		yellow: (s: string) => s,
		blue: (s: string) => s,
	},
}));

vi.mock("../../../utils/logger", () => ({
	Logger: {
		title: vi.fn(),
		success: vi.fn(),
		error: vi.fn(),
		info: vi.fn(),
		log: vi.fn(),
	},
}));

describe("statusCommand", () => {
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

	it("should call core getRepositoryStatus and display title", async () => {
		vi.mocked(coreCommands.getRepositoryStatus).mockResolvedValue({
			success: true,
			items: [],
			total: 0,
			messages: [{ type: "info", message: "Repository Status" }],
		});

		await statusCommand();

		expect(coreCommands.getRepositoryStatus).toHaveBeenCalledWith();
		expect(Logger.title).toHaveBeenCalledWith("Repository Status");
		expect(exitSpy).not.toHaveBeenCalled();
	});

	it("should handle errors and exit with code 1", async () => {
		vi.mocked(coreCommands.getRepositoryStatus).mockResolvedValue({
			success: false,
			items: [],
			total: 0,
			messages: [{ type: "error", message: "Failed to get status" }],
		});

		await statusCommand();

		expect(Logger.error).toHaveBeenCalledWith("Failed to get status");
		expect(exitSpy).toHaveBeenCalledWith(1);
	});
});
