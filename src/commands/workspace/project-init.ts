/**
 * CLI wrapper for project-init command
 */
import { initProjectConfigs, ProjectInitOptions } from "@baseline/core/commands";
import { wrapCommand } from "../../utils";

export async function projectInitCommand(
	options: ProjectInitOptions = {}
): Promise<void> {
	await wrapCommand(
		"Initializing Project Configs",
		() => initProjectConfigs(options)
	);
}

