/**
 * CLI wrapper for workspace setup command
 * Combines config + project-init
 */
import { configCommand } from "./config";
import { projectInitCommand } from "./project-init";

export interface SetupOptions {
	force?: boolean;
}

export async function setupCommand(options: SetupOptions = {}): Promise<void> {
	try {
		await configCommand({ force: options.force });
		await projectInitCommand({ force: options.force });
	} catch (error) {
		console.error(
			`Error: ${error instanceof Error ? error.message : String(error)}`
		);
		process.exit(1);
	}
}

