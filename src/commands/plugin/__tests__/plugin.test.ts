/**
 * Tests for plugin command wrappers.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
	pluginInstallCommand,
	pluginListCommand,
	pluginRemoveCommand,
	pluginInstallAllCommand,
	pluginSearchCommand,
} from "../plugin";
import * as coreCommands from "@baseline/core/commands";
import { wrapCommand } from "../../../utils/wrapper";

// Mock dependencies
vi.mock("@baseline/core/commands", () => ({
	installPlugin: vi.fn(),
	listPlugins: vi.fn(),
	removePlugin: vi.fn(),
	installAllPlugins: vi.fn(),
	searchPlugins: vi.fn(),
}));

vi.mock("../../../utils/wrapper", () => ({
	wrapCommand: vi.fn(),
}));

describe("Plugin Commands", () => {
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

	describe("pluginInstallCommand", () => {
		it("should call wrapCommand with correct title", async () => {
			vi.mocked(coreCommands.installPlugin).mockResolvedValue({
				success: true,
				pluginId: "my-plugin",
				addedToConfig: true,
				messages: [],
			});

			await pluginInstallCommand("my-plugin", {});

			expect(wrapCommand).toHaveBeenCalledWith(
				"Installing Plugin: my-plugin",
				expect.any(Function)
			);
			expect(coreCommands.installPlugin).toHaveBeenCalledWith("my-plugin", {});
		});
	});

	describe("pluginListCommand", () => {
		it("should call wrapCommand with correct title", async () => {
			vi.mocked(coreCommands.listPlugins).mockResolvedValue({
				success: true,
				plugins: [],
				messages: [],
			});

			await pluginListCommand({});

			expect(wrapCommand).toHaveBeenCalledWith(
				"Installed Plugins",
				expect.any(Function)
			);
			expect(coreCommands.listPlugins).toHaveBeenCalledWith({});
		});
	});

	describe("pluginRemoveCommand", () => {
		it("should call wrapCommand with correct title", async () => {
			vi.mocked(coreCommands.removePlugin).mockResolvedValue({
				success: true,
				pluginId: "my-plugin",
				removedFromConfig: true,
				messages: [],
			});

			await pluginRemoveCommand("my-plugin", {});

			expect(wrapCommand).toHaveBeenCalledWith(
				"Removing Plugin: my-plugin",
				expect.any(Function)
			);
			expect(coreCommands.removePlugin).toHaveBeenCalledWith("my-plugin", {});
		});
	});

	describe("pluginInstallAllCommand", () => {
		it("should call wrapCommand with correct title", async () => {
			vi.mocked(coreCommands.installAllPlugins).mockResolvedValue({
				success: true,
				installed: 0,
				failed: 0,
				plugins: [],
				messages: [],
			});

			await pluginInstallAllCommand({});

			expect(wrapCommand).toHaveBeenCalledWith(
				"Installing All Plugin Dependencies",
				expect.any(Function)
			);
			expect(coreCommands.installAllPlugins).toHaveBeenCalledWith({});
		});
	});

	describe("pluginSearchCommand", () => {
		it("should call wrapCommand with correct title", async () => {
			vi.mocked(coreCommands.searchPlugins).mockResolvedValue({
				success: true,
				plugins: [],
				messages: [],
			});

			await pluginSearchCommand("query", {});

			expect(wrapCommand).toHaveBeenCalledWith(
				"Searching for plugins: query",
				expect.any(Function)
			);
			expect(coreCommands.searchPlugins).toHaveBeenCalledWith("query", {});
		});
	});
});
