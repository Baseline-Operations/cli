/**
 * Tests for workspace link command wrapper.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { linkCommand } from "../link";
import * as coreCommands from "@baseline/core/commands";
import { wrapCommand } from "../../../utils/wrapper";

// Mock dependencies
vi.mock("@baseline/core/commands", () => ({
	linkRepositories: vi.fn(),
}));

vi.mock("../../../utils/wrapper", () => ({
	wrapCommand: vi.fn(),
}));

describe("linkCommand", () => {
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
		vi.mocked(coreCommands.linkRepositories).mockResolvedValue({
			success: true,
			succeeded: 0,
			failed: 0,
			skipped: 0,
			linkedConfigs: [],
			messages: [],
		});

		await linkCommand();

		expect(wrapCommand).toHaveBeenCalledWith(
			"Linking Workspace",
			expect.any(Function)
		);
		expect(coreCommands.linkRepositories).toHaveBeenCalledWith({});
	});
});
