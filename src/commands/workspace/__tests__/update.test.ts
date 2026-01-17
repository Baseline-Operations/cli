/**
 * Tests for workspace update command wrapper.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { updateCommand } from "../update";
import * as coreCommands from "@baseline/core/commands";
import { wrapCommand } from "../../../utils/wrapper";

// Mock dependencies
vi.mock("@baseline/core/commands", () => ({
	updateWorkspace: vi.fn(),
}));

vi.mock("../../../utils/wrapper", () => ({
	wrapCommand: vi.fn(),
}));

describe("updateCommand", () => {
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
		vi.mocked(coreCommands.updateWorkspace).mockResolvedValue({
			success: true,
			succeeded: 0,
			failed: 0,
			messages: [],
		});

		await updateCommand({});

		expect(wrapCommand).toHaveBeenCalledWith(
			"Updating Workspace",
			expect.any(Function)
		);
		expect(coreCommands.updateWorkspace).toHaveBeenCalledWith({});
	});

	it("should pass options to core command", async () => {
		vi.mocked(coreCommands.updateWorkspace).mockResolvedValue({
			success: true,
			succeeded: 0,
			failed: 0,
			messages: [],
		});

		await updateCommand({ skipSync: true, skipInstall: true, parallel: true });

		expect(coreCommands.updateWorkspace).toHaveBeenCalledWith({
			skipSync: true,
			skipInstall: true,
			parallel: true,
		});
	});
});
