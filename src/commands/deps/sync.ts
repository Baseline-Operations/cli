/**
 * CLI wrapper for deps sync command
 */
import { syncDependencyVersions } from "@baseline/core/commands";
import { wrapCommand } from "../../utils";

import { parseStringOption, parseBooleanOption } from "../../utils/option-parser";

export async function depsSyncCommand(
	options: {
		package?: string;
		strategy?: "highest" | "lowest" | "exact";
		updateLockfile?: boolean;
	} = {}
): Promise<void> {
	const strategy = parseStringOption(options.strategy, {
		default: "highest",
		allowedValues: ["highest", "lowest", "exact"] as const,
	});
	const updateLockfile = parseBooleanOption(options.updateLockfile, false);
	const lockfileMode = updateLockfile ? " (updating lockfile)" : "";
	
	await wrapCommand(`Syncing Dependency Versions (${strategy})${lockfileMode}`, () =>
		syncDependencyVersions({
			packageFilter: options.package,
			strategy: strategy as "highest" | "lowest" | "exact",
			updateLockfile,
		})
	);
}

