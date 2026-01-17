/**
 * CLI wrapper for deps list command
 */
import { listDependencies } from "@baseline/core/commands";
import { wrapCommand } from "../../utils";

export async function depsListCommand(
	options: { package?: string; filter?: string } = {}
): Promise<void> {
	await wrapCommand("Listing Dependencies", () =>
		listDependencies({
			packageFilter: options.package,
			dependencyFilter: options.filter,
		})
	);
}

