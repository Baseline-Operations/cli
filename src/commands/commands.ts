/**
 * Command metadata definitions.
 * 
 * This file contains all command metadata for auto-registration.
 * Commands are organized by group for better maintainability.
 */

import { registerCommand, type CommandMetadata, type CommandGroupMetadata } from "./metadata";

// Import command handlers
import { initCommand } from "./workspace/init";
import { addCommand } from "./workspace/add";
import { cloneCommand } from "./git/clone";
import { statusCommand } from "./git/status";
import { doctorCommand } from "./workspace/doctor";
import { graphCommand } from "./workspace/graph";
import { syncCommand } from "./git/sync";
import { branchCommand } from "./git/branch";
import { prCreateCommand } from "./git/pr";
import { setupCommand } from "./workspace/setup";
import { configCommand } from "./workspace/config";
import { linkCommand } from "./workspace/link";
import { updateCommand } from "./workspace/update";
import { syncWorkspaceCommand } from "./workspace/sync";
import { execCommand } from "./run/exec";
import { testCommand } from "./run/test";
import { lintCommand } from "./run/lint";
import { startCommand } from "./run/start";
import { watchCommand } from "./run/watch";
import { dockerComposeCommand } from "./run/docker-compose";
import { releaseCommand } from "./dev/release";
import { depsListCommand } from "./deps/list";
import { depsOutdatedCommand } from "./deps/outdated";
import { depsUpdateCommand } from "./deps/update";
import { depsSyncCommand } from "./deps/sync";
import { depsInstallCommand } from "./deps/install";
import { depsCacheCommand } from "./deps/cache";
import {
	pluginInstallCommand,
	pluginListCommand,
	pluginRemoveCommand,
	pluginInstallAllCommand,
	pluginSearchCommand,
} from "./plugin/plugin";

/**
 * Register all commands.
 * This function should be called during CLI initialization.
 */
export function registerAllCommands(): void {
	// Top-level commands
	registerCommand({
		name: "init",
		alias: "i",
		description: "Initialize a new baseline workspace",
		handler: async () => {
			await initCommand();
		},
	} as CommandMetadata);

	registerCommand({
		name: "add",
		alias: "a",
		description: "Add a repository to the workspace",
		arguments: [
			{
				name: "<gitUrl>",
				description: "Repository URL or path",
				required: true,
			},
		],
		options: [
			{
				flags: "--name <name>",
				description: "Custom name for the repository",
			},
			{
				flags: "--branch <branch>",
				description: "Branch to track",
			},
		],
		handler: async (args, options) => {
			await addCommand(args["gitUrl"] as string, {
				name: options["name"] as string,
			});
		},
	} as CommandMetadata);

	registerCommand({
		name: "clone",
		alias: "c",
		description: "Clone all repositories",
		handler: async () => {
			await cloneCommand();
		},
	} as CommandMetadata);

	registerCommand({
		name: "status",
		alias: "s",
		description: "Show status of all repositories",
		handler: async () => {
			await statusCommand();
		},
	} as CommandMetadata);

	registerCommand({
		name: "doctor",
		alias: "d",
		description: "Validate workspace configuration",
		handler: async () => {
			await doctorCommand();
		},
	} as CommandMetadata);

	registerCommand({
		name: "graph",
		alias: "g",
		description: "Generate dependency graph visualization",
		options: [
			{
				flags: "--format <format>",
				description: "Output format (text, dot, json, html, pdf)",
				defaultValue: "text",
			},
			{
				flags: "--output <file>",
				description: "Output file (default: stdout)",
			},
		],
		handler: async (_, options) => {
			await graphCommand(options);
		},
	} as CommandMetadata);

	// Git group
	registerCommand({
		name: "git",
		description: "Git operations",
		commands: [
			{
				name: "sync",
				description: "Sync repositories (fetch + pull)",
				handler: async () => {
					await syncCommand();
				},
			},
			{
				name: "branch",
				description: "Create/checkout branch across repos",
				arguments: [
					{
						name: "<name>",
						description: "Branch name",
						required: true,
					},
				],
				options: [
					{
						flags: "--create",
						description: "Create new branch",
					},
				],
				handler: async (args, options) => {
					await branchCommand(args["name"] as string, {
						create: options["create"] as boolean,
					});
				},
			},
			{
				name: "pr",
				description: "Pull request operations",
				commands: [
					{
						name: "create",
						description: "Create pull requests",
						options: [
							{
								flags: "-r, --repo <repo>",
								description: "Specific repository",
							},
							{
								flags: "-t, --title <title>",
								description: "PR title",
							},
							{
								flags: "-b, --body <body>",
								description: "PR body",
							},
							{
								flags: "--draft",
								description: "Create as draft",
							},
						],
						handler: async (_, options) => {
							await prCreateCommand({
								repo: options["repo"] as string,
								title: options["title"] as string,
								body: options["body"] as string,
								draft: options["draft"] as boolean,
							});
						},
					},
				],
			},
		],
	} as CommandGroupMetadata);

	// Workspace group
	registerCommand({
		name: "workspace",
		alias: "ws",
		description: "Workspace management",
		commands: [
			{
				name: "setup",
				description: "Setup workspace (config + project-init)",
				options: [
					{
						flags: "--force",
						description: "Force overwrite existing configs",
					},
				],
				handler: async (_, options) => {
					await setupCommand({ force: options.force as boolean });
				},
			},
			{
				name: "config",
				description: "Generate editor workspace files",
				options: [
					{
						flags: "--force",
						description: "Force overwrite existing configs",
					},
					{
						flags: "--auto-detect",
						description: "Auto-detect installed editors",
					},
				],
				handler: async (_, options) => {
					await configCommand({
						force: options.force as boolean,
						autoDetect: options["auto-detect"] as boolean,
					});
				},
			},
			{
				name: "link",
				description: "Link packages using workspace protocols",
				handler: async () => {
					await linkCommand();
				},
			},
			{
				name: "update",
				description: "Update workspace (sync repos + install dependencies)",
				options: [
					{
						flags: "--skip-sync",
						description: "Skip git sync step",
					},
					{
						flags: "--skip-install",
						description: "Skip dependency installation step",
					},
					{
						flags: "--parallel",
						description: "Install dependencies in parallel",
					},
				],
				handler: async (_, options) => {
					await updateCommand(options);
				},
			},
			{
				name: "sync",
				description: "Sync workspace configurations (regenerate package manager configs)",
				options: [
					{
						flags: "--force",
						description: "Force regeneration even if already linked",
					},
				],
				handler: async (_, options) => {
					await syncWorkspaceCommand(options);
				},
			},
		],
	} as CommandGroupMetadata);

	// Run group
	registerCommand({
		name: "run",
		description: "Run commands across repositories",
		commands: [
			{
				name: "test",
				alias: "t",
				description: "Run tests across repositories",
				options: [
					{
						flags: "--filter <filter>",
						description: "Filter repositories",
					},
					{
						flags: "--parallel",
						description: "Run in parallel",
					},
					{
						flags: "--fail-fast",
						description: "Stop on first error",
					},
				],
				handler: async (_, options) => {
					await testCommand(options);
				},
			},
			{
				name: "lint",
				alias: "l",
				description: "Run linting across repositories",
				options: [
					{
						flags: "--filter <filter>",
						description: "Filter repositories",
					},
					{
						flags: "--parallel",
						description: "Run in parallel",
					},
					{
						flags: "--fail-fast",
						description: "Stop on first error",
					},
				],
				handler: async (_, options) => {
					await lintCommand(options);
				},
			},
			{
				name: "start",
				description: "Start applications",
				options: [
					{
						flags: "--filter <filter>",
						description: "Filter repositories",
					},
				],
				handler: async (_, options) => {
					await startCommand(options);
				},
			},
			{
				name: "watch",
				alias: "w",
				description: "Watch for changes",
				options: [
					{
						flags: "--filter <filter>",
						description: "Filter repositories",
					},
				],
				handler: async (_, options) => {
					await watchCommand(options);
				},
			},
			{
				name: "docker-compose",
				alias: "dc",
				description: "Docker Compose operations",
				arguments: [
					{
						name: "<subcommand>",
						description: "Subcommand: up, down, start, stop, ps, logs",
						required: true,
					},
				],
				options: [
					{
						flags: "-f, --file <file>",
						description: "Compose file name (default: docker-compose.yml)",
					},
					{
						flags: "-d, --detach",
						description: "Detached mode: run in background",
					},
					{
						flags: "--build",
						description: "Build images before starting",
					},
					{
						flags: "--services <services...>",
						description: "Service names",
						variadic: true,
					},
				],
				handler: async (args, options) => {
					const subcommand = args["subcommand"] as string;
					await dockerComposeCommand(subcommand as any, options);
				},
			},
		],
	} as CommandGroupMetadata);

	// Development group
	registerCommand({
		name: "dev",
		description: "Development operations",
		commands: [
			{
				name: "release",
				alias: "r",
				description: "Release management",
				commands: [
					{
						name: "plan",
						description: "Show release plan",
						handler: async () => {
							await releaseCommand("plan");
						},
					},
					{
						name: "version",
						description: "Bump versions",
						handler: async () => {
							await releaseCommand("version");
						},
					},
					{
						name: "publish",
						description: "Publish packages",
						handler: async () => {
							await releaseCommand("publish");
						},
					},
				],
			},
		],
	} as CommandGroupMetadata);

	// Dependency management group
	registerCommand({
		name: "deps",
		alias: "dependencies",
		description: "Dependency management",
		commands: [
			{
				name: "list",
				description: "List all dependencies",
				options: [
					{
						flags: "--package <package>",
						description: "Filter by package name",
					},
					{
						flags: "--filter <filter>",
						description: "Filter by dependency name",
					},
				],
				handler: async (_, options) => {
					await depsListCommand(options);
				},
			},
			{
				name: "outdated",
				description: "Check for outdated dependencies",
				options: [
					{
						flags: "--package <package>",
						description: "Filter by package name",
					},
				],
				handler: async (_, options) => {
					await depsOutdatedCommand(options);
				},
			},
			{
				name: "update",
				description: "Update dependencies",
				options: [
					{
						flags: "--package <package>",
						description: "Filter by package name",
					},
					{
						flags: "--dependencies <deps...>",
						description: "Specific dependencies to update",
						variadic: true,
					},
					{
						flags: "--strategy <strategy>",
						description: "Update strategy (latest|major|minor|patch)",
					},
				],
				handler: async (_, options) => {
					await depsUpdateCommand(options);
				},
			},
			{
				name: "sync",
				description: "Synchronize dependency versions across packages",
				options: [
					{
						flags: "--package <package>",
						description: "Filter by package name",
					},
					{
						flags: "--strategy <strategy>",
						description: "Sync strategy (highest|lowest|exact)",
					},
					{
						flags: "--update-lockfile",
						description: "Update lock file after sync",
					},
				],
				handler: async (_, options) => {
					await depsSyncCommand(options);
				},
			},
			{
				name: "install",
				description: "Install dependencies",
				options: [
					{
						flags: "--package <package>",
						description: "Filter by package name",
					},
					{
						flags: "--parallel",
						description: "Install in parallel",
					},
					{
						flags: "--frozen-lockfile",
						description: "Fail if lock file is out of sync",
					},
					{
						flags: "--update-lockfile",
						description: "Update lock file after installation",
					},
				],
				handler: async (_, options) => {
					await depsInstallCommand(options);
				},
			},
			{
				name: "cache",
				description: "Manage dependency caches",
				commands: [
					{
						name: "info",
						description: "Show cache information",
						options: [
							{
								flags: "--package-manager <pm>",
								description: "Filter by package manager",
							},
						],
						handler: async (_, options) => {
							await depsCacheCommand({
								action: "info",
								packageManager: options["package-manager"] as string,
							});
						},
					},
					{
						name: "clear",
						description: "Clear dependency caches",
						options: [
							{
								flags: "--package-manager <pm>",
								description: "Filter by package manager",
							},
							{
								flags: "--dry-run",
								description: "Dry run (don't actually clear)",
							},
						],
						handler: async (_, options) => {
							await depsCacheCommand({
								action: "clear",
								dryRun: options["dry-run"] as boolean,
								packageManager: options["package-manager"] as string,
							});
						},
					},
					{
						name: "list",
						description: "List cached packages",
						options: [
							{
								flags: "--package-manager <pm>",
								description: "Filter by package manager",
							},
						],
						handler: async (_, options) => {
							await depsCacheCommand({
								action: "list",
								packageManager: options["package-manager"] as string,
							});
						},
					},
				],
			},
		],
	} as CommandGroupMetadata);

	// Plugin group
	registerCommand({
		name: "plugin",
		description: "Plugin management",
		commands: [
			{
				name: "install",
				description: "Install a plugin",
				arguments: [
					{
						name: "<pluginId>",
						description: "Plugin ID",
						required: true,
					},
				],
				options: [
					{
						flags: "--version <version>",
						description: "Plugin version",
					},
					{
						flags: "--source <source>",
						description: "Plugin source (npm|git|local)",
					},
					{
						flags: "--url <url>",
						description: "Plugin URL",
					},
					{
						flags: "--path <path>",
						description: "Plugin path",
					},
					{
						flags: "--no-save",
						description: "Don't save to baseline.json",
					},
				],
				handler: async (args, options) => {
					await pluginInstallCommand(args["pluginId"] as string, options);
				},
			},
			{
				name: "list",
				description: "List installed plugins",
				handler: async () => {
					await pluginListCommand();
				},
			},
			{
				name: "remove",
				description: "Remove plugin",
				arguments: [
					{
						name: "<pluginId>",
						description: "Plugin ID",
						required: true,
					},
				],
				handler: async (args) => {
					await pluginRemoveCommand(args["pluginId"] as string);
				},
			},
			{
				name: "install-all",
				description: "Install all plugins from baseline.json",
				handler: async () => {
					await pluginInstallAllCommand();
				},
			},
			{
				name: "search",
				description: "Search for plugins",
				arguments: [
					{
						name: "<query>",
						description: "Search query",
						required: true,
					},
				],
				options: [
					{
						flags: "--registry",
						description: "Search plugin registry instead of npm",
					},
				],
				handler: async (args, options) => {
					await pluginSearchCommand(args["query"] as string, {
						registry: options.registry as boolean,
					});
				},
			},
		],
	} as CommandGroupMetadata);
}

