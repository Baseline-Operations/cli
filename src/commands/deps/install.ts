/**
 * CLI wrapper for deps install command
 */
import { installDependencies } from "@baseline/core/commands";
import { wrapCommand } from "../../utils";

export async function depsInstallCommand(
	options: {
		package?: string;
		parallel?: boolean;
		frozenLockfile?: boolean;
		updateLockfile?: boolean;
	} = {}
): Promise<void> {
	const mode = options.parallel ? " (parallel)" : "";
	const lockfileMode = options.frozenLockfile
		? " (frozen lockfile)"
		: options.updateLockfile
			? " (updating lockfile)"
			: "";
	await wrapCommand(`Installing Dependencies${mode}${lockfileMode}`, () =>
		installDependencies({
			packageFilter: options.package,
			parallel: options.parallel,
			frozenLockfile: options.frozenLockfile,
			updateLockfile: options.updateLockfile,
		})
	);
}

