/**
 * Tests for git pr command wrapper.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { prCreateCommand } from "../pr";
import * as coreCommands from "@baseline/core/commands";
import { Logger } from "../../../utils/logger";

// Mock dependencies
vi.mock("@baseline/core/commands", () => ({
	createPullRequests: vi.fn(),
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

describe("prCreateCommand", () => {
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

	it("should call core createPullRequests and display messages", async () => {
		vi.mocked(coreCommands.createPullRequests).mockResolvedValue({
			success: true,
			data: { created: 1, failed: 0, skipped: 0, prUrls: [] },
			messages: [
				{ type: "info", message: "Creating Pull Requests" },
				{ type: "success", message: "Pull request created successfully" },
			],
		});

		await prCreateCommand({ title: "feat: new feature" });

		expect(coreCommands.createPullRequests).toHaveBeenCalledWith({
			title: "feat: new feature",
		});
		expect(Logger.title).toHaveBeenCalledWith("Creating Pull Requests");
		expect(Logger.success).toHaveBeenCalledWith("Pull request created successfully");
	});

	it("should pass options to core command", async () => {
		vi.mocked(coreCommands.createPullRequests).mockResolvedValue({
			success: true,
			data: { created: 1, failed: 0, skipped: 0, prUrls: [] },
			messages: [],
		});

		const options = { title: "feat: new feature", base: "main", draft: true };
		await prCreateCommand(options);

		expect(coreCommands.createPullRequests).toHaveBeenCalledWith(options);
	});

	it("should handle errors and exit with code 1", async () => {
		vi.mocked(coreCommands.createPullRequests).mockResolvedValue({
			success: false,
			data: { created: 0, failed: 0, skipped: 0, prUrls: [] },
			messages: [{ type: "error", message: "Failed to create PR" }],
		});

		await prCreateCommand({ title: "feat: new feature" });

		expect(Logger.error).toHaveBeenCalledWith("Failed to create PR");
		expect(exitSpy).toHaveBeenCalledWith(1);
	});
});
