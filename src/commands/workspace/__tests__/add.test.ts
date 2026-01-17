/**
 * Tests for workspace add command wrapper.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { addCommand } from "../add";
import * as coreCommands from "@baseline/core/commands";
import { ConfigManager } from "@baseline/core/config";
import { Logger } from "../../../utils/logger";

// Mock dependencies
vi.mock("@baseline/core/commands", () => ({
	addRepository: vi.fn(),
}));

vi.mock("@baseline/core/config", () => ({
	ConfigManager: vi.fn(),
}));

vi.mock("../../../utils/logger", () => ({
	Logger: {
		title: vi.fn(),
		success: vi.fn(),
		error: vi.fn(),
		info: vi.fn(),
	},
}));

describe("addCommand", () => {
	let mockConfigManager: any;
	let originalExit: typeof process.exit;
	let exitSpy: any;

	beforeEach(() => {
		vi.clearAllMocks();

		// Mock ConfigManager
		mockConfigManager = {
			getWorkspaceRoot: vi.fn().mockReturnValue("/workspace/root"),
		};
		vi.mocked(ConfigManager).mockImplementation(() => mockConfigManager as any);

		// Mock process.exit
		originalExit = process.exit;
		exitSpy = vi.fn();
		process.exit = exitSpy as any;
	});

	afterEach(() => {
		process.exit = originalExit;
		vi.restoreAllMocks();
	});

	it("should call core addRepository with correct arguments", async () => {
		vi.mocked(coreCommands.addRepository).mockResolvedValue({
			success: true,
			data: {
				id: "test-repo",
				name: "test-repo",
				path: "test-repo",
				defaultBranch: "main",
				library: false,
				startInDocker: false,
				gitUrl: "https://github.com/user/repo.git",
			},
		});

		await addCommand("https://github.com/user/repo.git", {});

		expect(coreCommands.addRepository).toHaveBeenCalledWith(
			"https://github.com/user/repo.git",
			{ workspaceRoot: "/workspace/root" }
		);
	});

	it("should display success message when repository is added", async () => {
		vi.mocked(coreCommands.addRepository).mockResolvedValue({
			success: true,
			data: {
				id: "test-repo",
				name: "test-repo",
				path: "test-repo",
				defaultBranch: "main",
				library: false,
				startInDocker: false,
				gitUrl: "https://github.com/user/repo.git",
			},
		});

		await addCommand("https://github.com/user/repo.git", {});

		expect(Logger.success).toHaveBeenCalledWith(
			"Added repository: test-repo"
		);
	});

	it("should handle success with name option", async () => {
		vi.mocked(coreCommands.addRepository).mockResolvedValue({
			success: true,
			data: {
				id: "custom-name",
				name: "custom-name",
				path: "custom-name",
				defaultBranch: "main",
				library: false,
				startInDocker: false,
			},
		});

		await addCommand("https://github.com/user/repo.git", {
			name: "custom-name",
		});

		expect(Logger.success).toHaveBeenCalledWith(
			"Added repository: custom-name"
		);
	});

	it("should handle errors and exit with code 1", async () => {
		vi.mocked(coreCommands.addRepository).mockResolvedValue({
			success: false,
			errors: ["Repository already exists"],
		});

		await addCommand("https://github.com/user/repo.git", {});

		expect(Logger.error).toHaveBeenCalledWith(
			"Failed to add repository/package:"
		);
		expect(Logger.error).toHaveBeenCalledWith("  Repository already exists");
		expect(exitSpy).toHaveBeenCalledWith(1);
	});

	it("should handle thrown errors", async () => {
		const error = new Error("Network error");
		vi.mocked(coreCommands.addRepository).mockRejectedValue(error);

		await addCommand("https://github.com/user/repo.git", {});

		expect(Logger.error).toHaveBeenCalledWith(
			`Failed to add repository: ${error.message}`
		);
		expect(exitSpy).toHaveBeenCalledWith(1);
	});

	it("should pass options to core command", async () => {
		vi.mocked(coreCommands.addRepository).mockResolvedValue({
			success: true,
			data: {
				id: "test-repo",
				name: "test-repo",
				path: "test-repo",
				defaultBranch: "main",
				library: false,
				startInDocker: false,
			},
		});

		const options = {
			name: "custom-name",
			branch: "main",
		};

		await addCommand("https://github.com/user/repo.git", options);

		expect(coreCommands.addRepository).toHaveBeenCalledWith(
			"https://github.com/user/repo.git",
			{ ...options, workspaceRoot: "/workspace/root" }
		);
	});
});
