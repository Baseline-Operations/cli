/**
 * Tests for command registry.
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import type { Command } from "commander";
import { registerCommands } from "../registry";
import { registerCommand, commandRegistry, type CommandMetadata, type CommandGroupMetadata } from "../metadata";

// Mock commander
const createMockCommand = (): Command => {
	const commands: Command[] = [];
	const options: Array<{ flags: string; description: string; defaultValue?: unknown }> = [];
	const aliases: string[] = [];

	const cmd = {
		command: vi.fn((name: string) => {
			const subCmd = createMockCommand();
			commands.push(subCmd);
			return subCmd;
		}),
		option: vi.fn((flags: string, description: string = "", defaultValue?: unknown) => {
			options.push({ flags, description, defaultValue });
			return cmd;
		}),
		alias: vi.fn((alias: string) => {
			aliases.push(alias);
			return cmd;
		}),
		description: vi.fn((desc: string) => cmd),
		action: vi.fn((handler: (...args: unknown[]) => void | Promise<void>) => {
			(cmd as any)._handler = handler;
			return cmd;
		}),
		commands,
		options,
		aliases,
	} as unknown as Command;

	return cmd;
};

describe("registerCommands", () => {
	let program: Command;

	beforeEach(() => {
		program = createMockCommand();
		// Clear registry before each test
		commandRegistry.length = 0;
	});

	it("should register a single command", () => {
		const metadata: CommandMetadata = {
			name: "test",
			description: "Test command",
			handler: vi.fn(),
		};

		registerCommand(metadata);
		registerCommands(program);

		expect(program.command).toHaveBeenCalledWith("test");
		expect(commandRegistry).toHaveLength(1);
	});

	it("should register command with alias", () => {
		const metadata: CommandMetadata = {
			name: "test",
			alias: "t",
			description: "Test command",
			handler: vi.fn(),
		};

		registerCommand(metadata);
		registerCommands(program);

		const registeredCmd = (program as any).commands[0];
		expect(registeredCmd.alias).toHaveBeenCalledWith("t");
	});

	it("should register command with options", () => {
		const metadata: CommandMetadata = {
			name: "test",
			description: "Test command",
			options: [
				{ flags: "--flag", description: "A flag" },
				{ flags: "--value <value>", description: "A value", defaultValue: "default" },
			],
			handler: vi.fn(),
		};

		registerCommand(metadata);
		registerCommands(program);

		const registeredCmd = (program as any).commands[0];
		expect(registeredCmd.option).toHaveBeenCalled();
		// Check that options were registered (Commander.js doesn't pass undefined explicitly)
		const optionCalls = registeredCmd.option.mock.calls;
		expect(optionCalls.some((call: unknown[]) => call[0] === "--flag" && call[1] === "A flag")).toBe(true);
		expect(optionCalls.some((call: unknown[]) => call[0] === "--value <value>" && call[1] === "A value")).toBe(true);
	});

	it("should register command with arguments", () => {
		const metadata: CommandMetadata = {
			name: "test",
			description: "Test command",
			arguments: [{ name: "<arg1>", description: "First argument" }],
			handler: vi.fn(),
		};

		registerCommand(metadata);
		registerCommands(program);

		expect(program.command).toHaveBeenCalledWith("test <arg1>");
	});

	it("should register command group", () => {
		const groupMetadata: CommandGroupMetadata = {
			name: "group",
			description: "Command group",
			commands: [
				{
					name: "sub1",
					description: "Subcommand 1",
					handler: vi.fn(),
				},
				{
					name: "sub2",
					description: "Subcommand 2",
					handler: vi.fn(),
				},
			],
		};

		registerCommand(groupMetadata);
		registerCommands(program);

		expect(program.command).toHaveBeenCalledWith("group");
		const groupCmd = (program as any).commands[0];
		expect(groupCmd.command).toHaveBeenCalledWith("sub1");
		expect(groupCmd.command).toHaveBeenCalledWith("sub2");
	});

	it("should call handler with parsed arguments and options", async () => {
		const handler = vi.fn().mockResolvedValue(undefined);
		const metadata: CommandMetadata = {
			name: "test",
			description: "Test command",
			arguments: [{ name: "<arg1>", required: true }],
			options: [{ flags: "--opt <value>" }],
			handler,
		};

		registerCommand(metadata);
		registerCommands(program);

		const registeredCmd = (program as any).commands[0];
		const actionHandler = registeredCmd.action.mock.calls[0][0];

		// Simulate Commander.js argument passing: (arg1, ..., options, command)
		await actionHandler("value1", { opt: "optionValue" }, {});

		expect(handler).toHaveBeenCalledWith(
			{ arg1: "value1" },
			{ opt: "optionValue" }
		);
	});

	it("should handle errors in handler", async () => {
		const originalConsoleError = console.error;
		const originalExit = process.exit;
		const exitSpy = vi.fn();
		const errorSpy = vi.fn();

		console.error = errorSpy;
		process.exit = exitSpy as any;

		const error = new Error("Handler error");
		const handler = vi.fn().mockRejectedValue(error);
		const metadata: CommandMetadata = {
			name: "test",
			description: "Test command",
			handler,
		};

		registerCommand(metadata);
		registerCommands(program);

		const registeredCmd = (program as any).commands[0];
		const actionHandler = registeredCmd.action.mock.calls[0][0];

		await actionHandler();

		expect(errorSpy).toHaveBeenCalledWith("Error: Handler error");
		expect(exitSpy).toHaveBeenCalledWith(1);

		console.error = originalConsoleError;
		process.exit = originalExit;
	});
});
