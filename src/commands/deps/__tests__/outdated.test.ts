/**
 * Tests for deps outdated command wrapper.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { depsOutdatedCommand } from "../outdated";
import * as coreCommands from "@baseline/core/commands";
import { wrapCommand } from "../../../utils/wrapper";

// Mock dependencies
vi.mock("@baseline/core/commands", () => ({
	checkOutdatedDependencies: vi.fn(),
}));

vi.mock("../../../utils/wrapper", () => ({
	wrapCommand: vi.fn(),
}));

describe("depsOutdatedCommand", () => {
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
		vi.mocked(coreCommands.checkOutdatedDependencies).mockResolvedValue({
			success: true,
			outdated: [],
			totalOutdated: 0,
			totalPackages: 0,
			messages: [],
		});

		await depsOutdatedCommand({});

		expect(wrapCommand).toHaveBeenCalledWith(
			"Checking Outdated Dependencies",
			expect.any(Function)
		);
		expect(coreCommands.checkOutdatedDependencies).toHaveBeenCalledWith({
			packageFilter: undefined,
		});
	});

	it("should pass packageFilter to core command", async () => {
		vi.mocked(coreCommands.checkOutdatedDependencies).mockResolvedValue({
			success: true,
			outdated: [],
			totalOutdated: 0,
			totalPackages: 0,
			messages: [],
		});

		await depsOutdatedCommand({ package: "my-package" });

		expect(coreCommands.checkOutdatedDependencies).toHaveBeenCalledWith({
			packageFilter: "my-package",
		});
	});
});
