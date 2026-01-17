/**
 * Tests for workspace project-init command wrapper.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { projectInitCommand } from "../project-init";
import * as coreCommands from "@baseline/core/commands";
import { wrapCommand } from "../../../utils/wrapper";

// Mock dependencies
vi.mock("@baseline/core/commands", () => ({
	initProjectConfigs: vi.fn(),
}));

vi.mock("../../../utils/wrapper", () => ({
	wrapCommand: vi.fn(),
}));

describe("projectInitCommand", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		// Make wrapCommand actually execute the command function
		vi.mocked(wrapCommand).mockImplementation(async (title, command) => {
			await command();
		});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("should call wrapCommand with correct title", async () => {
		vi.mocked(coreCommands.initProjectConfigs).mockResolvedValue({
			success: true,
			generated: 0,
			updated: 0,
			skipped: 0,
			totalRepos: 0,
			configFiles: [],
			messages: [],
			errorRepos: [],
			skippedRepos: [],
		});

		await projectInitCommand({});

		expect(wrapCommand).toHaveBeenCalledWith(
			"Initializing Project Configs",
			expect.any(Function)
		);
		expect(coreCommands.initProjectConfigs).toHaveBeenCalledWith({});
	});
});
