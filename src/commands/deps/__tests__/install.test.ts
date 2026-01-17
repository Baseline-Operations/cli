/**
 * Tests for deps install command wrapper.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { depsInstallCommand } from "../install";
import * as coreCommands from "@baseline/core/commands";
import { wrapCommand } from "../../../utils/wrapper";

// Mock dependencies
vi.mock("@baseline/core/commands", () => ({
	installDependencies: vi.fn(),
}));

vi.mock("../../../utils/wrapper", () => ({
	wrapCommand: vi.fn(),
}));

describe("depsInstallCommand", () => {
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
		vi.mocked(coreCommands.installDependencies).mockResolvedValue({
			success: true,
			succeeded: 0,
			failed: 0,
			skipped: 0,
			messages: [],
			installedPackages: [],
		});

		await depsInstallCommand({});

		expect(wrapCommand).toHaveBeenCalledWith(
			"Installing Dependencies",
			expect.any(Function)
		);
		expect(coreCommands.installDependencies).toHaveBeenCalledWith({
			packageFilter: undefined,
			parallel: undefined,
			frozenLockfile: undefined,
			updateLockfile: undefined,
		});
	});

	it("should include 'parallel' in title when parallel option is true", async () => {
		vi.mocked(coreCommands.installDependencies).mockResolvedValue({
			success: true,
			succeeded: 0,
			failed: 0,
			skipped: 0,
			messages: [],
			installedPackages: [],
		});

		await depsInstallCommand({ parallel: true });

		expect(wrapCommand).toHaveBeenCalledWith(
			"Installing Dependencies (parallel)",
			expect.any(Function)
		);
		expect(coreCommands.installDependencies).toHaveBeenCalledWith({
			packageFilter: undefined,
			parallel: true,
			frozenLockfile: undefined,
			updateLockfile: undefined,
		});
	});

	it("should include 'frozen lockfile' in title when frozenLockfile is true", async () => {
		vi.mocked(coreCommands.installDependencies).mockResolvedValue({
			success: true,
			succeeded: 0,
			failed: 0,
			skipped: 0,
			messages: [],
			installedPackages: [],
		});

		await depsInstallCommand({ frozenLockfile: true });

		expect(wrapCommand).toHaveBeenCalledWith(
			"Installing Dependencies (frozen lockfile)",
			expect.any(Function)
		);
		expect(coreCommands.installDependencies).toHaveBeenCalledWith({
			packageFilter: undefined,
			parallel: undefined,
			frozenLockfile: true,
			updateLockfile: undefined,
		});
	});

	it("should include 'updating lockfile' in title when updateLockfile is true", async () => {
		vi.mocked(coreCommands.installDependencies).mockResolvedValue({
			success: true,
			succeeded: 0,
			failed: 0,
			skipped: 0,
			messages: [],
			installedPackages: [],
		});

		await depsInstallCommand({ updateLockfile: true });

		expect(wrapCommand).toHaveBeenCalledWith(
			"Installing Dependencies (updating lockfile)",
			expect.any(Function)
		);
		expect(coreCommands.installDependencies).toHaveBeenCalledWith({
			packageFilter: undefined,
			parallel: undefined,
			frozenLockfile: undefined,
			updateLockfile: true,
		});
	});

	it("should pass packageFilter to core command", async () => {
		vi.mocked(coreCommands.installDependencies).mockResolvedValue({
			success: true,
			succeeded: 0,
			failed: 0,
			skipped: 0,
			messages: [],
			installedPackages: [],
		});

		await depsInstallCommand({ package: "my-package" });

		expect(coreCommands.installDependencies).toHaveBeenCalledWith({
			packageFilter: "my-package",
			parallel: undefined,
			frozenLockfile: undefined,
			updateLockfile: undefined,
		});
	});

	it("should combine all options correctly", async () => {
		vi.mocked(coreCommands.installDependencies).mockResolvedValue({
			success: true,
			succeeded: 0,
			failed: 0,
			skipped: 0,
			messages: [],
			installedPackages: [],
		});

		await depsInstallCommand({
			package: "my-package",
			parallel: true,
			frozenLockfile: true,
		});

		expect(wrapCommand).toHaveBeenCalledWith(
			"Installing Dependencies (parallel) (frozen lockfile)",
			expect.any(Function)
		);
		expect(coreCommands.installDependencies).toHaveBeenCalledWith({
			packageFilter: "my-package",
			parallel: true,
			frozenLockfile: true,
			updateLockfile: undefined,
		});
	});

	it("should handle priority: frozenLockfile over updateLockfile in title", async () => {
		vi.mocked(coreCommands.installDependencies).mockResolvedValue({
			success: true,
			succeeded: 0,
			failed: 0,
			skipped: 0,
			messages: [],
			installedPackages: [],
		});

		// If both are provided, frozenLockfile takes precedence in title
		await depsInstallCommand({
			frozenLockfile: true,
			updateLockfile: true,
		});

		expect(wrapCommand).toHaveBeenCalledWith(
			"Installing Dependencies (frozen lockfile)",
			expect.any(Function)
		);
	});
});
