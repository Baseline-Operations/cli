/**
 * Tests for git sync command wrapper.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { syncCommand } from "../sync";
import * as coreCommands from "@baseline/core/commands";
import { wrapCommand } from "../../../utils/wrapper";

// Mock dependencies
vi.mock("@baseline/core/commands", () => ({
	syncRepositories: vi.fn(),
}));

vi.mock("../../../utils/wrapper", () => ({
	wrapCommand: vi.fn(),
}));

describe("syncCommand", () => {
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
		vi.mocked(coreCommands.syncRepositories).mockResolvedValue({
			success: true,
			succeeded: 0,
			failed: 0,
			skipped: 0,
			messages: [],
		});

		await syncCommand();

		expect(wrapCommand).toHaveBeenCalledWith(
			"Syncing Repositories",
			coreCommands.syncRepositories
		);
		expect(coreCommands.syncRepositories).toHaveBeenCalledWith();
	});
});
