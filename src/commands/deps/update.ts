/**
 * CLI wrapper for deps update command
 */
import { updateDependencies } from "@baseline/core/commands";
import { wrapCommand } from "../../utils";

import { parseStringOption, parseArrayOption } from "../../utils/option-parser";

export async function depsUpdateCommand(
	options: {
		package?: string;
		dependencies?: string[];
		strategy?: "latest" | "major" | "minor" | "patch";
	} = {}
): Promise<void> {
	const strategy = parseStringOption(options.strategy, {
		default: "latest",
		allowedValues: ["latest", "major", "minor", "patch"] as const,
	});
	const dependencies = parseArrayOption(options.dependencies);
	
	await wrapCommand(`Updating Dependencies (${strategy})`, () =>
		updateDependencies({
			packageFilter: options.package,
			dependencies: dependencies.length > 0 ? dependencies : undefined,
			strategy: strategy as "latest" | "major" | "minor" | "patch",
		})
	);
}

