/**
 * Generic CLI wrapper utility for command functions.
 * Handles common patterns like error catching, message logging, and exit codes.
 * This eliminates boilerplate in CLI command wrappers.
 */
import { Logger } from "./logger";
import type { BaseResult } from "@baseline/core/types";
import { createSpinner, succeedSpinner, failSpinner, stopSpinner, updateSpinner } from "./progress";

/**
 * Wrap a command function with standard error handling and logging.
 * 
 * @param title - Title to display before command execution
 * @param command - Command function that returns a result object
 * @returns Promise that resolves when command completes
 */
export async function wrapCommand<T extends BaseResult>(
	title: string,
	command: () => Promise<T>
): Promise<void> {
	const spinner = createSpinner(title);
	try {
		const result = await command();
		
		// Stop spinner before displaying messages (will be replaced by detailed messages)
		if (result.messages && result.messages.length > 0) {
			stopSpinner(spinner);
			Logger.title(title);
		} else {
			// No messages - keep spinner and show success/failure
			// (will be handled below)
		}

		if (result.messages) {
			for (const msg of result.messages) {
				if (
					msg.type === "info" &&
					(msg.message.includes("Summary") || 
					 msg.message.includes("Repository Status") ||
					 msg.message.includes("Dependency Graph"))
				) {
					Logger.title(msg.message);
				} else if (msg.type === "info") {
					Logger.info(msg.message);
				} else if (msg.type === "success") {
					Logger.success(msg.message);
				} else if (msg.type === "error") {
					Logger.error(msg.message);
					// Show suggestion if available
					if (msg.suggestion) {
						Logger.info(`💡 ${msg.suggestion}`);
					}
				} else if (msg.type === "warn") {
					Logger.warn(msg.message);
				} else if (msg.type === "dim") {
					Logger.dim(msg.message);
				}
			}
		}

		// Handle success/failure if no detailed messages
		if (!result.messages || result.messages.length === 0) {
			if (!result.success) {
				failSpinner(spinner, "Failed");
				process.exit(1);
			} else {
				succeedSpinner(spinner);
			}
		} else {
			// Detailed messages already displayed, just handle exit
			if (!result.success) {
				process.exit(1);
			}
		}
	} catch (error) {
		failSpinner(spinner, "Failed");
		Logger.error(
			`Failed: ${error instanceof Error ? error.message : String(error)}`
		);
		process.exit(1);
	}
}

