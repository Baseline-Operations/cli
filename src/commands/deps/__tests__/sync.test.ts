/**
 * Tests for deps sync command wrapper.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { depsSyncCommand } from "../sync";
import * as coreCommands from "@baseline/core/commands";
import { wrapCommand } from "../../../utils/wrapper";

// Mock dependencies
vi.mock("@baseline/core/commands", () => ({
	syncDependencyVersions: vi.fn(),
}));

vi.mock("../../../utils/wrapper", () => ({
	wrapCommand: vi.fn(),
}));

describe("depsSyncCommand", () => {
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

	it("should call wrapCommand with correct title for default options", async () => {
		vi.mocked(coreCommands.syncDependencyVersions).mockResolvedValue({
			success: true,
			conflicts: [],
			synced: [],
			totalConflicts: 0,
			totalSynced: 0,
			messages: [],
		});

		await depsSyncCommand({});

		expect(wrapCommand).toHaveBeenCalledWith(
			"Syncing Dependency Versions (highest)",
			expect.any(Function)
		);
		expect(coreCommands.syncDependencyVersions).toHaveBeenCalledWith({
			packageFilter: undefined,
			strategy: "highest",
			updateLockfile: undefined,
		});
	});

	it("should pass strategy to core command", async () => {
		vi.mocked(coreCommands.syncDependencyVersions).mockResolvedValue({
			success: true,
			conflicts: [],
			synced: [],
			totalConflicts: 0,
			totalSynced: 0,
			messages: [],
		});

		await depsSyncCommand({ strategy: "highest" });

		expect(coreCommands.syncDependencyVersions).toHaveBeenCalledWith({
			packageFilter: undefined,
			strategy: "highest",
			updateLockfile: undefined,
		});
	});

	it("should pass packageFilter to core command", async () => {
		vi.mocked(coreCommands.syncDependencyVersions).mockResolvedValue({
			success: true,
			conflicts: [],
			synced: [],
			totalConflicts: 0,
			totalSynced: 0,
			messages: [],
		});

		await depsSyncCommand({ package: "my-package" });

		expect(coreCommands.syncDependencyVersions).toHaveBeenCalledWith({
			packageFilter: "my-package",
			strategy: "highest",
			updateLockfile: undefined,
		});
	});
});
