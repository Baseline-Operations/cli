/**
 * Tests for run exec command wrapper.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { execCommand } from "../exec";
import * as coreCommands from "@baseline/core/commands";
import { wrapCommand } from "../../../utils/wrapper";

// Mock dependencies
vi.mock("@baseline/core/commands", () => ({
	executeCommand: vi.fn(),
}));

vi.mock("../../../utils/wrapper", () => ({
	wrapCommand: vi.fn(),
}));

describe("execCommand", () => {
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
		vi.mocked(coreCommands.executeCommand).mockResolvedValue({
			success: true,
			succeeded: 0,
			failed: 0,
			skipped: 0,
			messages: [],
		});

		await execCommand("npm test", {});

		expect(wrapCommand).toHaveBeenCalledWith(
			"Executing: npm test",
			expect.any(Function)
		);
		expect(coreCommands.executeCommand).toHaveBeenCalledWith(
			"npm test",
			{}
		);
	});

	it("should pass options to core command", async () => {
		vi.mocked(coreCommands.executeCommand).mockResolvedValue({
			success: true,
			succeeded: 0,
			failed: 0,
			skipped: 0,
			messages: [],
		});

		const options = { filter: "my-package", parallel: true };
		await execCommand("npm test", options);

		expect(coreCommands.executeCommand).toHaveBeenCalledWith(
			"npm test",
			options
		);
	});
});
