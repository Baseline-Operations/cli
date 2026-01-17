/**
 * CLI wrapper for sync command
 */
import { syncRepositories } from "@baseline/core/commands";
import { wrapCommand } from "../../utils";

export async function syncCommand(): Promise<void> {
	await wrapCommand("Syncing Repositories", syncRepositories);
}

