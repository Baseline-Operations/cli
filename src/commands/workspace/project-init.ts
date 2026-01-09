/**
 * CLI wrapper for project-init command
 */
import { initProjectConfigs, ProjectInitOptions } from "@baseline/core/commands";
import { Logger } from "@baseline/core/utils";

export async function projectInitCommand(
	options: ProjectInitOptions = {}
): Promise<void> {
	try {
		const result = await initProjectConfigs(options);

		if (!result.success && result.totalRepos === 0) {
			Logger.error(result.messages[0]?.message || "Failed to initialize project configs");
			process.exit(1);
			return;
		}

		// Log all messages
		for (const msg of result.messages) {
			if (msg.type === "info") {
				if (msg.message.includes("Summary") || msg.message.includes("Initializing")) {
					Logger.title(msg.message);
				} else {
					Logger.info(msg.message);
				}
			} else if (msg.type === "success") {
				Logger.success(msg.message);
			} else if (msg.type === "error") {
				Logger.error(msg.message);
			} else if (msg.type === "warn") {
				Logger.warn(msg.message);
			} else if (msg.type === "dim") {
				Logger.dim(msg.message);
			}
		}

		if (!result.success) {
			process.exit(1);
		}
	} catch (error) {
		Logger.error(
			`Failed to initialize project configs: ${error instanceof Error ? error.message : String(error)}`
		);
		process.exit(1);
	}
}

