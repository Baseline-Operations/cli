/**
 * CLI wrapper for workspace sync command
 */
import { syncWorkspace } from "@baseline/core/commands";
import { wrapCommand } from "../../utils";

export async function syncWorkspaceCommand(
	options: { force?: boolean } = {}
): Promise<void> {
	await wrapCommand("Syncing Workspace", () =>
		syncWorkspace({
			force: options.force,
		})
	);
}

