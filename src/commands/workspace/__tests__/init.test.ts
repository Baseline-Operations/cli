/**
 * Tests for workspace init command wrapper.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { initCommand } from "../init";
import * as coreCommands from "@baseline/core/commands";
import * as coreUtils from "@baseline/core/utils";
import { Logger } from "../../../utils/logger";

// Mock dependencies
vi.mock("@baseline/core/commands", () => ({
	initWorkspace: vi.fn(),
}));

vi.mock("@baseline/core/utils", () => ({
	getCommandName: vi.fn(),
}));

vi.mock("../../../utils/logger", () => ({
	Logger: {
		title: vi.fn(),
		success: vi.fn(),
		error: vi.fn(),
		info: vi.fn(),
		log: vi.fn(),
	},
}));

describe("initCommand", () => {
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

	it("should display title and call core initWorkspace", async () => {
		vi.mocked(coreCommands.initWorkspace).mockResolvedValue({
			success: true,
			workspaceRoot: "/workspace",
			configPath: "/workspace/baseline.json",
			generatedFiles: ["baseline.json", ".gitignore"],
		});

		await initCommand({});

		expect(Logger.title).toHaveBeenCalledWith("Baseline Workspace Setup");
		expect(coreCommands.initWorkspace).toHaveBeenCalledWith({});
	});

	it("should display success messages when initialization succeeds", async () => {
		vi.mocked(coreUtils.getCommandName).mockReturnValue("baseline");

		const generatedFiles = ["baseline.json", ".gitignore", ".vscode/baseline.code-workspace"];
		vi.mocked(coreCommands.initWorkspace).mockResolvedValue({
			success: true,
			workspaceRoot: "/workspace",
			configPath: "/workspace/baseline.json",
			generatedFiles,
		});

		await initCommand({});

		expect(Logger.success).toHaveBeenCalledWith("Created /workspace/baseline.json");
		generatedFiles.forEach((file) => {
			expect(Logger.success).toHaveBeenCalledWith(`Created ${file}`);
		});
		expect(Logger.title).toHaveBeenCalledWith("Setup Complete!");
	});

	it("should handle errors and exit with code 1", async () => {
		vi.mocked(coreCommands.initWorkspace).mockResolvedValue({
			success: false,
			workspaceRoot: "/workspace",
			configPath: "/workspace/baseline.json",
			generatedFiles: [],
			errors: ["Config file already exists"],
		});

		await initCommand({});

		expect(Logger.error).toHaveBeenCalledWith("Failed to initialize workspace:");
		expect(Logger.error).toHaveBeenCalledWith("  Config file already exists");
		expect(exitSpy).toHaveBeenCalledWith(1);
	});

	it("should pass options to core command", async () => {
		vi.mocked(coreCommands.initWorkspace).mockResolvedValue({
			success: true,
			workspaceRoot: "/custom/path",
			configPath: "/custom/path/baseline.json",
			generatedFiles: ["baseline.json"],
		});

		const options = { workspaceRoot: "/custom/path", force: true };
		await initCommand(options);

		expect(coreCommands.initWorkspace).toHaveBeenCalledWith(options);
	});

	it("should handle thrown errors", async () => {
		const error = new Error("Network error");
		vi.mocked(coreCommands.initWorkspace).mockRejectedValue(error);

		await initCommand({});

		expect(Logger.error).toHaveBeenCalledWith(
			`Failed to initialize workspace: ${error.message}`
		);
		expect(exitSpy).toHaveBeenCalledWith(1);
	});
});
