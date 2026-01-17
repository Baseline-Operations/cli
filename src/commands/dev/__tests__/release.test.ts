/**
 * Tests for dev release command wrapper.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { releaseCommand } from "../release";
import * as coreCommands from "@baseline/core/commands";
import { Logger } from "../../../utils/logger";

// Mock dependencies
vi.mock("@baseline/core/commands", () => ({
	releaseCommand: vi.fn(),
}));

vi.mock("../../../utils/logger", () => ({
	Logger: {
		title: vi.fn(),
		section: vi.fn(),
		success: vi.fn(),
		error: vi.fn(),
		info: vi.fn(),
		warn: vi.fn(),
		dim: vi.fn(),
		table: vi.fn(),
	},
}));

describe("releaseCommand", () => {
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

	it("should call core releaseCommand for plan subcommand", async () => {
		vi.mocked(coreCommands.releaseCommand).mockResolvedValue({
			success: true,
			messages: [],
		});

		await releaseCommand("plan", {});

		expect(Logger.title).toHaveBeenCalledWith("Release Plan");
		expect(coreCommands.releaseCommand).toHaveBeenCalledWith("plan", {});
	});

	it("should call core releaseCommand for version subcommand", async () => {
		vi.mocked(coreCommands.releaseCommand).mockResolvedValue({
			success: true,
			messages: [],
		});

		await releaseCommand("version", {});

		expect(Logger.title).toHaveBeenCalledWith("Version Bump");
		expect(coreCommands.releaseCommand).toHaveBeenCalledWith("version", {});
	});

	it("should call core releaseCommand for publish subcommand", async () => {
		vi.mocked(coreCommands.releaseCommand).mockResolvedValue({
			success: true,
			messages: [],
		});

		await releaseCommand("publish", {});

		expect(Logger.title).toHaveBeenCalledWith("Publishing Packages");
		expect(coreCommands.releaseCommand).toHaveBeenCalledWith("publish", {});
	});

	it("should handle errors and exit with code 1", async () => {
		vi.mocked(coreCommands.releaseCommand).mockResolvedValue({
			success: false,
			messages: [{ type: "error", message: "Release failed" }],
		});

		await releaseCommand("plan", {});

		expect(Logger.error).toHaveBeenCalledWith("Release failed");
		expect(exitSpy).toHaveBeenCalledWith(1);
	});
});
