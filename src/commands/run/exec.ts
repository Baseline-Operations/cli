/**
 * CLI wrapper for exec command
 */
import { executeCommand, ExecOptions } from "@baseline/core/commands";
import { wrapCommand } from "../../utils";

export async function execCommand(
	command: string,
	options: ExecOptions = {}
): Promise<void> {
	await wrapCommand(
		`Executing: ${command}`,
		() => executeCommand(command, options)
	);
}

