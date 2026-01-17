#!/usr/bin/env node
import { Command } from "commander";
import { readFile } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { getCommandName } from "@baseline/core/utils";
import { ConfigManager } from "@baseline/core/config";
import { registerCommands } from "./commands/registry";
import { registerAllCommands } from "./commands/commands";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function getVersion(): Promise<string> {
	try {
		const packageJsonPath = join(__dirname, "../package.json");
		const packageJson = JSON.parse(
			await readFile(packageJsonPath, "utf-8")
		);
		return packageJson.version || "0.1.0";
	} catch {
		return "0.1.0";
	}
}

async function main() {
	const version = await getVersion();
	
	const workspaceRoot = ConfigManager.findWorkspaceRoot() || process.cwd();
	const commandName = getCommandName(workspaceRoot);

	const program = new Command();

	program
		.name(commandName)
		.description("Manage multiple Git repositories as a single coordinated workspace")
		.version(version);

	// Register all commands from metadata
	registerAllCommands();
	registerCommands(program);

	program.parse();
}

main().catch((error) => {
	console.error(`Fatal error: ${error instanceof Error ? error.message : String(error)}`);
	process.exit(1);
});
