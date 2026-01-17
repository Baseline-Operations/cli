/**
 * CLI wrapper for release command
 */
import { releaseCommand as releaseCommandCore, ReleaseOptions } from "@baseline/core/commands";
import { Logger } from "../../utils";

export async function releaseCommand(
	subcommand: "plan" | "version" | "publish",
	options: ReleaseOptions = {}
): Promise<void> {
	const titleMap: Record<typeof subcommand, string> = {
		plan: "Release Plan",
		version: "Version Bump",
		publish: "Publishing Packages",
	};

	Logger.title(titleMap[subcommand]);
	try {
		const result = await releaseCommandCore(subcommand, options);

		// Log all messages
		if (result.messages) {
			for (const msg of result.messages) {
			if (msg.type === "info") {
				if (msg.message.includes("Release") || msg.message.includes("Version") || msg.message.includes("Publish")) {
					Logger.section(msg.message);
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

		// For plan command, show table if available
		if (subcommand === "plan" && result.data && "table" in result.data && result.data.table) {
			Logger.table(
				["Package", "Current Version", "Path", "Changes"],
				result.data.table
			);
		}

		if (!result.success) {
			process.exit(1);
		}
	} catch (error) {
		Logger.error(
			`Failed to run release: ${error instanceof Error ? error.message : String(error)}`
		);
		process.exit(1);
	}
}

