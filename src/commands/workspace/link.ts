/**
 * CLI wrapper for link command
 */
import { linkRepositories, LinkOptions } from "@baseline/core/commands";
import { wrapCommand } from "../../utils";

export async function linkCommand(
	options: LinkOptions = {}
): Promise<void> {
	await wrapCommand(
		"Linking Workspace",
		() => linkRepositories(options)
	);
}

