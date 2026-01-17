/**
 * CLI wrapper for clone command
 */
import { cloneRepositories } from "@baseline/core/commands";
import { wrapCommand } from "../../utils";

export async function cloneCommand(): Promise<void> {
	await wrapCommand("Cloning Repositories", cloneRepositories);
}

