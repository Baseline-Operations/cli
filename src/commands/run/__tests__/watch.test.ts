/**
 * Tests for run watch command wrapper.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { watchCommand } from "../watch";
import * as coreCommands from "@baseline/core/commands";
import { Logger } from "../../../utils/logger";

// Mock dependencies
vi.mock("@baseline/core/commands", () => ({
	watchRepositories: vi.fn(),
}));

vi.mock("../../../utils/logger", () => ({
	Logger: {
		title: vi.fn(),
		success: vi.fn(),
		error: vi.fn(),
		info: vi.fn(),
		warn: vi.fn(),
		log: vi.fn(),
		section: vi.fn(),
	},
}));

describe("watchCommand", () => {
	let originalExit: typeof process.exit;
	let exitSpy: any;

	beforeEach(() => {
		vi.clearAllMocks();

		// Mock process.exit
		originalExit = process.exit;
		exitSpy = vi.fn();
		process.exit = exitSpy as any;
	});

	afterEach(() => {
		process.exit = originalExit;
		vi.restoreAllMocks();
	});

	it("should call core watchRepositories and display messages", async () => {
		vi.mocked(coreCommands.watchRepositories).mockResolvedValue({
			success: true,
			data: { watchingCount: 0, totalRepos: 0, watchers: [], cleanup: vi.fn() },
			messages: [
				{ type: "info", message: "Watching Library Repositories" },
				{ type: "success", message: "Watching started" },
			],
		});

		await watchCommand({});

		// watchCommand adds callbacks to options before calling core
		expect(coreCommands.watchRepositories).toHaveBeenCalled();
		const callArgs = vi.mocked(coreCommands.watchRepositories).mock.calls[0][0];
		expect(callArgs).toHaveProperty("onFileChange");
		expect(callArgs).toHaveProperty("onWatchStart");
		expect(callArgs).toHaveProperty("onWatchStop");
		expect(callArgs).toHaveProperty("onError");
		expect(Logger.title).toHaveBeenCalledWith("Watching Library Repositories");
		expect(Logger.success).toHaveBeenCalledWith("Watching started");
	});

	it("should pass options to core command with callbacks", async () => {
		vi.mocked(coreCommands.watchRepositories).mockResolvedValue({
			success: true,
			data: { watchingCount: 0, totalRepos: 0, watchers: [], cleanup: vi.fn() },
			messages: [],
		});

		const options = { filter: "my-package" };
		await watchCommand(options);

		// watchCommand adds callbacks to options before calling core
		expect(coreCommands.watchRepositories).toHaveBeenCalled();
		const callArgs = vi.mocked(coreCommands.watchRepositories).mock.calls[0][0];
		expect(callArgs).toMatchObject({ filter: "my-package" });
		expect(callArgs).toHaveProperty("onFileChange");
		expect(callArgs).toHaveProperty("onWatchStart");
		expect(callArgs).toHaveProperty("onWatchStop");
		expect(callArgs).toHaveProperty("onError");
	});

	it("should handle errors and exit with code 1", async () => {
		vi.mocked(coreCommands.watchRepositories).mockResolvedValue({
			success: false,
			data: undefined,
			messages: [{ type: "error", message: "Failed to start watching" }],
		});

		await watchCommand({});

		expect(Logger.error).toHaveBeenCalledWith("Failed to start watching");
		expect(exitSpy).toHaveBeenCalledWith(1);
	});
});
