/**
 * CLI wrapper for plugin commands
 */
import {
	installPlugin,
	listPlugins,
	removePlugin,
	installAllPlugins,
	searchPlugins,
	PluginInstallOptions,
} from "@baseline/core/commands";
import { wrapCommand } from "../../utils";

export async function pluginInstallCommand(
	pluginId: string,
	options: PluginInstallOptions = {}
): Promise<void> {
	await wrapCommand(
		`Installing Plugin: ${pluginId}`,
		() => installPlugin(pluginId, options)
	);
}

export async function pluginListCommand(
	options: { workspaceRoot?: string } = {}
): Promise<void> {
	await wrapCommand("Installed Plugins", () => listPlugins(options));
}

export async function pluginRemoveCommand(
	pluginId: string,
	options: { removeFromConfig?: boolean; workspaceRoot?: string } = {}
): Promise<void> {
	await wrapCommand(
		`Removing Plugin: ${pluginId}`,
		() => removePlugin(pluginId, options)
	);
}

export async function pluginInstallAllCommand(
	options: { workspaceRoot?: string } = {}
): Promise<void> {
	await wrapCommand(
		"Installing All Plugin Dependencies",
		() => installAllPlugins(options)
	);
}

export async function pluginSearchCommand(
	query: string,
	options: { registry?: boolean; workspaceRoot?: string } = {}
): Promise<void> {
	await wrapCommand(
		`Searching for plugins: ${query}`,
		() => searchPlugins(query, options)
	);
}
