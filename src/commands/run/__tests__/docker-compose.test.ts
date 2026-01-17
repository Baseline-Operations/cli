/**
 * Tests for run docker-compose command wrapper.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { dockerComposeCommand } from "../docker-compose";
import * as coreCommands from "@baseline/core/commands";
import { wrapCommand } from "../../../utils/wrapper";

// Mock dependencies
vi.mock("@baseline/core/commands", () => ({
	dockerCompose: vi.fn(),
}));

vi.mock("../../../utils/wrapper", () => ({
	wrapCommand: vi.fn(),
}));

describe("dockerComposeCommand", () => {
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
		vi.mocked(coreCommands.dockerCompose).mockResolvedValue({
			success: true,
			subcommand: "up",
			processed: 0,
			failed: 0,
			totalFiles: 0,
			messages: [],
			failedRepos: [],
		});

		await dockerComposeCommand("up", {});

		expect(wrapCommand).toHaveBeenCalledWith(
			"Docker Compose: up",
			expect.any(Function)
		);
		expect(coreCommands.dockerCompose).toHaveBeenCalledWith("up", {});
	});

	it("should pass options to core command", async () => {
		vi.mocked(coreCommands.dockerCompose).mockResolvedValue({
			success: true,
			subcommand: "up",
			processed: 0,
			failed: 0,
			totalFiles: 0,
			messages: [],
			failedRepos: [],
		});

		const options = { services: ["app", "db"] };
		await dockerComposeCommand("up", options);

		expect(coreCommands.dockerCompose).toHaveBeenCalledWith("up", options);
	});
});
