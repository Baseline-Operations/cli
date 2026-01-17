/**
 * CLI wrapper for workspace update command
 */
import { updateWorkspace } from "@baseline/core/commands";
import { wrapCommand } from "../../utils";

export async function updateCommand(
	options: {
		skipSync?: boolean;
		skipInstall?: boolean;
		parallel?: boolean;
	} = {}
): Promise<void> {
	await wrapCommand("Updating Workspace", () =>
		updateWorkspace({
			skipSync: options.skipSync,
			skipInstall: options.skipInstall,
			parallel: options.parallel,
		})
	);
}

