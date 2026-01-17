/**
 * Tests for git clone command wrapper.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { cloneCommand } from "../clone";
import * as coreCommands from "@baseline/core/commands";
import { wrapCommand } from "../../../utils/wrapper";

// Mock dependencies
vi.mock("@baseline/core/commands", () => ({
	cloneRepositories: vi.fn(),
}));

vi.mock("../../../utils/wrapper", () => ({
	wrapCommand: vi.fn(),
}));

describe("cloneCommand", () => {
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
		vi.mocked(coreCommands.cloneRepositories).mockResolvedValue({
			success: true,
			succeeded: 0,
			failed: 0,
			skipped: 0,
			messages: [],
		});

		await cloneCommand();

		expect(wrapCommand).toHaveBeenCalledWith(
			"Cloning Repositories",
			coreCommands.cloneRepositories
		);
		expect(coreCommands.cloneRepositories).toHaveBeenCalledWith();
	});

});
