/**
 * CLI wrapper for add command
 */
import { addRepository, AddRepositoryOptions } from "@baseline/core/commands";
import { Logger } from "../../utils";
import { ConfigManager } from "@baseline/core/config";

export async function addCommand(
	gitUrl: string,
	options: AddRepositoryOptions = {}
): Promise<void> {
	try {
		const configManager = new ConfigManager();
		const workspaceRoot = configManager.getWorkspaceRoot();
		
		const result = await addRepository(gitUrl, {
			...options,
			workspaceRoot,
		});

		if (!result.success) {
			Logger.error("Failed to add repository/package:");
			if (result.messages) {
				result.messages.forEach((msg) => {
					if (msg.type === "error") {
						Logger.error(`  ${msg.message}`);
						// Show suggestion if available
						if (msg.suggestion) {
							Logger.info(`  💡 ${msg.suggestion}`);
						}
					}
				});
			} else if (result.errors) {
				result.errors.forEach((err) => Logger.error(`  ${err}`));
			}
			process.exit(1);
			return;
		}

		if (result.data) {
			Logger.success(`Added repository: ${result.data.name}`);
			Logger.info(`  URL: ${result.data.gitUrl || result.data.location}`);
			Logger.info(`  Path: ${result.data.path}`);
		}
	} catch (error) {
		Logger.error(
			`Failed to add repository: ${error instanceof Error ? error.message : String(error)}`
		);
		process.exit(1);
	}
}

