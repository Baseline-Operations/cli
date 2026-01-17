/**
 * CLI wrapper for deps outdated command
 */
import { checkOutdatedDependencies } from "@baseline/core/commands";
import { wrapCommand } from "../../utils";

export async function depsOutdatedCommand(
	options: { package?: string } = {}
): Promise<void> {
	await wrapCommand("Checking Outdated Dependencies", () =>
		checkOutdatedDependencies({
			packageFilter: options.package,
		})
	);
}

