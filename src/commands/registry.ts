/**
 * Command registry for auto-registration.
 * 
 * Automatically registers commands from metadata, reducing manual CLI setup.
 */

import type { Command } from "commander";
import type { CommandMetadata, CommandGroupMetadata, CommandArgument } from "./metadata";
import { commandRegistry } from "./metadata";

/**
 * Register a single command on a Commander program or parent command.
 */
function registerSingleCommand(
	parent: Command,
	metadata: CommandMetadata
): void {
	// Parse command name - could be "sync" or "git.sync" for nested commands
	const nameParts = metadata.name.split(".");
	const commandName = nameParts[nameParts.length - 1];
	
	// Build command string with arguments if provided
	let commandString = commandName;
	if (metadata.arguments && metadata.arguments.length > 0) {
		const argStrings = metadata.arguments.map((arg) => arg.name);
		commandString = `${commandName} ${argStrings.join(" ")}`;
	}
	
	const cmd = parent.command(commandString);

	if (metadata.description) {
		cmd.description(metadata.description);
	}

	if (metadata.alias) {
		cmd.alias(metadata.alias);
	}

	if (metadata.options) {
		for (const option of metadata.options) {
			if (option.defaultValue !== undefined && 
				(typeof option.defaultValue === "string" || 
				 typeof option.defaultValue === "boolean" || 
				 Array.isArray(option.defaultValue))) {
				cmd.option(option.flags, option.description || "", option.defaultValue as string | boolean | string[]);
			} else {
				cmd.option(option.flags, option.description || "");
			}
		}
	}

	if (metadata.hidden) {
		// Commander.js doesn't have a hidden property, but we can skip registration
		// For now, we'll just not set it
	}

	cmd.action(async (...args: unknown[]) => {
		try {
			// Commander.js passes arguments as: (arg1, arg2, ..., options, command)
			// The last argument is the Command object, second-to-last is options
			const commandArgs: Record<string, unknown> = {};
			const commandOptions: Record<string, unknown> = {};

			// Extract positional arguments (everything except last two which are options and command)
			if (metadata.arguments && metadata.arguments.length > 0) {
				const numArgs = metadata.arguments.length;
				for (let i = 0; i < numArgs && i < args.length - 2; i++) {
					const argMeta: CommandArgument = metadata.arguments[i];
					const argValue = args[i];
					if (argValue !== undefined) {
						// Remove < > from argument name for key
						const argKey = argMeta.name.replace(/[<>]/g, "");
						commandArgs[argKey] = argValue;
					}
				}
			}

			// Extract options (second-to-last argument)
			if (args.length >= 2) {
				const optionsObj = args[args.length - 2];
				if (optionsObj && typeof optionsObj === "object" && !Array.isArray(optionsObj)) {
					Object.assign(commandOptions, optionsObj);
				}
			}

			await metadata.handler(commandArgs, commandOptions);
		} catch (error) {
			console.error(
				`Error: ${error instanceof Error ? error.message : String(error)}`
			);
			process.exit(1);
		}
	});
}

/**
 * Register a command group on a Commander program or parent command.
 */
function registerCommandGroup(
	parent: Command,
	metadata: CommandGroupMetadata
): void {
	const group = parent.command(metadata.name);

	if (metadata.description) {
		group.description(metadata.description);
	}

	if (metadata.alias) {
		group.alias(metadata.alias);
	}

	// Register all commands in the group (can be nested groups or single commands)
	for (const cmdMetadata of metadata.commands) {
		if ("commands" in cmdMetadata) {
			// It's a nested group
			registerCommandGroup(group, cmdMetadata);
		} else {
			// It's a single command
			registerSingleCommand(group, cmdMetadata);
		}
	}
}

/**
 * Register all commands from the registry on a Commander program.
 */
export function registerCommands(program: Command): void {
	for (const metadata of commandRegistry) {
		if ("commands" in metadata) {
			// It's a command group
			registerCommandGroup(program, metadata);
		} else {
			// It's a single command
			registerSingleCommand(program, metadata);
		}
	}
}

