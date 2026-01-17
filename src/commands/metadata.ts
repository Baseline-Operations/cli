/**
 * Command metadata interface for auto-registration.
 * 
 * This allows commands to declare their metadata (name, description, options, etc.)
 * and be automatically registered in the CLI without manual setup.
 */

import type { Command } from "commander";

/**
 * Command option definition.
 */
export interface CommandOption {
	/**
	 * Option flags (e.g., "--parallel", "-p, --parallel")
	 */
	flags: string;
	/**
	 * Option description
	 */
	description?: string;
	/**
	 * Default value
	 */
	defaultValue?: unknown;
	/**
	 * Whether option is required
	 */
	required?: boolean;
}

/**
 * Command argument definition.
 */
export interface CommandArgument {
	/**
	 * Argument name (e.g., "<repo>", "<pluginId>")
	 */
	name: string;
	/**
	 * Argument description
	 */
	description?: string;
	/**
	 * Whether argument is required
	 */
	required?: boolean;
	/**
	 * Variadic (accepts multiple values)
	 */
	variadic?: boolean;
}

/**
 * Command metadata.
 */
export interface CommandMetadata {
	/**
	 * Command name (e.g., "init", "add", "deps install")
	 * For subcommands, use dot notation: "deps.install", "git.sync"
	 */
	name: string;
	/**
	 * Command description
	 */
	description: string;
	/**
	 * Command alias (e.g., "i" for "init")
	 */
	alias?: string;
	/**
	 * Command arguments
	 */
	arguments?: CommandArgument[];
	/**
	 * Command options
	 */
	options?: CommandOption[];
	/**
	 * Whether command is hidden from help
	 */
	hidden?: boolean;
	/**
	 * Command handler function
	 */
	handler: (args: Record<string, unknown>, options: Record<string, unknown>) => Promise<void> | void;
}

/**
 * Command group metadata.
 */
export interface CommandGroupMetadata {
	/**
	 * Group name (e.g., "deps", "git", "workspace")
	 */
	name: string;
	/**
	 * Group description
	 */
	description: string;
	/**
	 * Group alias (e.g., "d" for "deps", "ws" for "workspace")
	 */
	alias?: string;
	/**
	 * Commands in this group (can be nested groups)
	 */
	commands: Array<CommandMetadata | CommandGroupMetadata>;
}

/**
 * Registry of all command metadata.
 */
export const commandRegistry: Array<CommandMetadata | CommandGroupMetadata> = [];

/**
 * Register a command or command group.
 */
export function registerCommand(metadata: CommandMetadata | CommandGroupMetadata): void {
	commandRegistry.push(metadata);
}

