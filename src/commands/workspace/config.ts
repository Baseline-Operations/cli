/**
 * CLI wrapper for config command
 */
import { configRepositories, ConfigOptions } from "@baseline/core/commands";
import { wrapCommand } from "../../utils";

export async function configCommand(
	options: ConfigOptions = {}
): Promise<void> {
	await wrapCommand(
		"Generating Editor Workspace Files",
		() => configRepositories(options)
	);
}

