/**
 * Tests for deps cache command wrapper.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { depsCacheCommand } from "../cache";
import * as coreCommands from "@baseline/core/commands";
import { wrapCommand } from "../../../utils/wrapper";

// Mock dependencies
vi.mock("@baseline/core/commands", () => ({
	manageDependencyCache: vi.fn(),
}));

vi.mock("../../../utils/wrapper", () => ({
	wrapCommand: vi.fn(),
}));

describe("depsCacheCommand", () => {
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

	it("should call core manageDependencyCache for info action", async () => {
		vi.mocked(coreCommands.manageDependencyCache).mockResolvedValue({
			success: true,
			messages: [],
		});

		await depsCacheCommand({ action: "info" });

		expect(wrapCommand).toHaveBeenCalledWith(
			"Cache Information",
			expect.any(Function)
		);
		expect(coreCommands.manageDependencyCache).toHaveBeenCalledWith({
			action: "info",
			dryRun: undefined,
			packageManager: undefined,
		});
	});

	it("should call core manageDependencyCache for clear action", async () => {
		vi.mocked(coreCommands.manageDependencyCache).mockResolvedValue({
			success: true,
			messages: [],
		});

		await depsCacheCommand({ action: "clear" });

		expect(wrapCommand).toHaveBeenCalledWith(
			"Clearing Caches",
			expect.any(Function)
		);
		expect(coreCommands.manageDependencyCache).toHaveBeenCalledWith({
			action: "clear",
			dryRun: undefined,
			packageManager: undefined,
		});
	});

	it("should call core manageDependencyCache for list action", async () => {
		vi.mocked(coreCommands.manageDependencyCache).mockResolvedValue({
			success: true,
			messages: [],
		});

		await depsCacheCommand({ action: "list" });

		expect(wrapCommand).toHaveBeenCalledWith(
			"Listing Cached Packages",
			expect.any(Function)
		);
		expect(coreCommands.manageDependencyCache).toHaveBeenCalledWith({
			action: "list",
			dryRun: undefined,
			packageManager: undefined,
		});
	});

	it("should pass options to core command", async () => {
		vi.mocked(coreCommands.manageDependencyCache).mockResolvedValue({
			success: true,
			messages: [],
		});

		const options = { action: "clear" as const, packageManager: "npm", dryRun: true };
		await depsCacheCommand(options);

		expect(coreCommands.manageDependencyCache).toHaveBeenCalledWith(options);
	});
});
