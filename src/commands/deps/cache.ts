/**
 * CLI wrapper for deps cache command
 */
import { manageDependencyCache } from "@baseline/core/commands";
import { wrapCommand } from "../../utils";

export async function depsCacheCommand(
	options: {
		action?: "info" | "clear" | "list";
		dryRun?: boolean;
		packageManager?: string;
	} = {}
): Promise<void> {
	const action = options.action || "info";
	const actionName = action === "info" ? "Cache Information" : action === "clear" ? "Clearing Caches" : "Listing Cached Packages";
	await wrapCommand(actionName, () =>
		manageDependencyCache({
			action,
			dryRun: options.dryRun,
			packageManager: options.packageManager,
		})
	);
}
