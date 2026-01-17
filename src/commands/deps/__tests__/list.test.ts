/**
 * Tests for deps list command wrapper.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { depsListCommand } from "../list";
import * as coreCommands from "@baseline/core/commands";
import { wrapCommand } from "../../../utils/wrapper";

// Mock dependencies
vi.mock("@baseline/core/commands", () => ({
	listDependencies: vi.fn(),
}));

vi.mock("../../../utils/wrapper", () => ({
	wrapCommand: vi.fn(),
}));

describe("depsListCommand", () => {
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
		vi.mocked(coreCommands.listDependencies).mockResolvedValue({
			success: true,
			packages: [],
			totalPackages: 0,
			totalDependencies: 0,
			messages: [],
		});

		await depsListCommand({});

		expect(wrapCommand).toHaveBeenCalledWith(
			"Listing Dependencies",
			expect.any(Function)
		);
		expect(coreCommands.listDependencies).toHaveBeenCalledWith({
			packageFilter: undefined,
		});
	});

	it("should pass packageFilter to core command", async () => {
		vi.mocked(coreCommands.listDependencies).mockResolvedValue({
			success: true,
			packages: [],
			totalPackages: 0,
			totalDependencies: 0,
			messages: [],
		});

		await depsListCommand({ package: "my-package" });

		expect(coreCommands.listDependencies).toHaveBeenCalledWith({
			packageFilter: "my-package",
		});
	});
});
