/**
 * Tests for workspace sync command wrapper.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { syncWorkspaceCommand } from "../sync";
import * as coreCommands from "@baseline/core/commands";
import { wrapCommand } from "../../../utils/wrapper";

// Mock dependencies
vi.mock("@baseline/core/commands", () => ({
	syncWorkspace: vi.fn(),
}));

vi.mock("../../../utils/wrapper", () => ({
	wrapCommand: vi.fn(),
}));

describe("syncWorkspaceCommand", () => {
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
		vi.mocked(coreCommands.syncWorkspace).mockResolvedValue({
			success: true,
			regenerated: 0,
			skipped: 0,
			succeeded: 0,
			failed: 0,
			messages: [],
		});

		await syncWorkspaceCommand({});

		expect(wrapCommand).toHaveBeenCalledWith(
			"Syncing Workspace",
			expect.any(Function)
		);
		expect(coreCommands.syncWorkspace).toHaveBeenCalledWith({});
	});

	it("should pass options to core command", async () => {
		vi.mocked(coreCommands.syncWorkspace).mockResolvedValue({
			success: true,
			regenerated: 0,
			skipped: 0,
			succeeded: 0,
			failed: 0,
			messages: [],
		});

		await syncWorkspaceCommand({ force: true });

		expect(coreCommands.syncWorkspace).toHaveBeenCalledWith({
			force: true,
		});
	});
});
