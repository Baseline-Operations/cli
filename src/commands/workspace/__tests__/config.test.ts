/**
 * Tests for workspace config command wrapper.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { configCommand } from "../config";
import * as coreCommands from "@baseline/core/commands";
import { wrapCommand } from "../../../utils/wrapper";

// Mock dependencies
vi.mock("@baseline/core/commands", () => ({
	configRepositories: vi.fn(),
}));

vi.mock("../../../utils/wrapper", () => ({
	wrapCommand: vi.fn(),
}));

describe("configCommand", () => {
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
		vi.mocked(coreCommands.configRepositories).mockResolvedValue({
			success: true,
			succeeded: 0,
			failed: 0,
			skipped: 0,
			messages: [],
		});

		await configCommand({});

		expect(wrapCommand).toHaveBeenCalledWith(
			"Generating Editor Workspace Files",
			expect.any(Function)
		);
		expect(coreCommands.configRepositories).toHaveBeenCalledWith({});
	});

	it("should pass options to core command", async () => {
		vi.mocked(coreCommands.configRepositories).mockResolvedValue({
			success: true,
			succeeded: 0,
			failed: 0,
			skipped: 0,
			messages: [],
		});

		await configCommand({});

		expect(coreCommands.configRepositories).toHaveBeenCalledWith({});
	});
});
