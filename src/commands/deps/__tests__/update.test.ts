/**
 * Tests for deps update command wrapper.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { depsUpdateCommand } from "../update";
import * as coreCommands from "@baseline/core/commands";
import { wrapCommand } from "../../../utils/wrapper";

// Mock dependencies
vi.mock("@baseline/core/commands", () => ({
	updateDependencies: vi.fn(),
}));

vi.mock("../../../utils/wrapper", () => ({
	wrapCommand: vi.fn(),
}));

describe("depsUpdateCommand", () => {
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
		vi.mocked(coreCommands.updateDependencies).mockResolvedValue({
			success: true,
			succeeded: 0,
			failed: 0,
			updatedPackages: [],
			messages: [],
		});

		await depsUpdateCommand({});

		expect(wrapCommand).toHaveBeenCalledWith(
			"Updating Dependencies (latest)",
			expect.any(Function)
		);
		expect(coreCommands.updateDependencies).toHaveBeenCalledWith({
			packageFilter: undefined,
			dependencies: undefined,
			strategy: "latest",
		});
	});

	it("should include strategy in title when provided", async () => {
		vi.mocked(coreCommands.updateDependencies).mockResolvedValue({
			success: true,
			succeeded: 0,
			failed: 0,
			updatedPackages: [],
			messages: [],
		});

		await depsUpdateCommand({ strategy: "latest" });

		expect(wrapCommand).toHaveBeenCalledWith(
			"Updating Dependencies (latest)",
			expect.any(Function)
		);
		expect(coreCommands.updateDependencies).toHaveBeenCalledWith({
			packageFilter: undefined,
			dependencies: undefined,
			strategy: "latest",
		});
	});


	it("should pass dependencies array to core command", async () => {
		vi.mocked(coreCommands.updateDependencies).mockResolvedValue({
			success: true,
			succeeded: 0,
			failed: 0,
			updatedPackages: [],
			messages: [],
		});

		await depsUpdateCommand({ dependencies: ["lodash", "express"] });

		expect(coreCommands.updateDependencies).toHaveBeenCalledWith({
			packageFilter: undefined,
			dependencies: ["lodash", "express"],
			strategy: "latest",
		});
	});

	it("should pass all options correctly", async () => {
		vi.mocked(coreCommands.updateDependencies).mockResolvedValue({
			success: true,
			succeeded: 0,
			failed: 0,
			updatedPackages: [],
			messages: [],
		});

		await depsUpdateCommand({
			package: "my-package",
			dependencies: ["lodash"],
			strategy: "patch",
		});

		expect(coreCommands.updateDependencies).toHaveBeenCalledWith({
			packageFilter: "my-package",
			dependencies: ["lodash"],
			strategy: "patch",
		});
	});
});
