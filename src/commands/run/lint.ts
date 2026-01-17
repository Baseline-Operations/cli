/**
 * CLI wrapper for lint command
 */
import { runLint, LintOptions } from "@baseline/core/commands";
import { Logger } from "../../utils";

export async function lintCommand(
	options: LintOptions = {}
): Promise<void> {
	try {
		const result = await runLint(options);

		if (!result.success && result.messages && result.messages.length > 0) {
			Logger.error(result.messages[0]?.message || "Failed to run lint");
			process.exit(1);
			return;
		}

		// Log all messages
		if (result.messages) {
			for (const msg of result.messages) {
			if (msg.type === "info") {
				if (msg.message.includes("Running Linters")) {
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
		}

		if (!result.success) {
			process.exit(1);
		}
	} catch (error) {
		Logger.error(
			`Failed to run lint: ${error instanceof Error ? error.message : String(error)}`
		);
		process.exit(1);
	}
}

