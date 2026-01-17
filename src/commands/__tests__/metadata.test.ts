/**
 * Tests for command metadata.
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { registerCommand, commandRegistry, type CommandMetadata, type CommandGroupMetadata } from "../metadata";

describe("command metadata", () => {
	beforeEach(() => {
		// Clear registry before each test
		commandRegistry.length = 0;
	});

	describe("registerCommand", () => {
		it("should register a command metadata", () => {
			const metadata: CommandMetadata = {
				name: "test",
				description: "Test command",
				handler: vi.fn(),
			};

			registerCommand(metadata);

			expect(commandRegistry).toHaveLength(1);
			expect(commandRegistry[0]).toBe(metadata);
		});

		it("should register a command group metadata", () => {
			const groupMetadata: CommandGroupMetadata = {
				name: "group",
				description: "Command group",
				commands: [],
			};

			registerCommand(groupMetadata);

			expect(commandRegistry).toHaveLength(1);
			expect(commandRegistry[0]).toBe(groupMetadata);
		});

		it("should register multiple commands", () => {
			const cmd1: CommandMetadata = {
				name: "cmd1",
				description: "Command 1",
				handler: vi.fn(),
			};
			const cmd2: CommandMetadata = {
				name: "cmd2",
				description: "Command 2",
				handler: vi.fn(),
			};

			registerCommand(cmd1);
			registerCommand(cmd2);

			expect(commandRegistry).toHaveLength(2);
			expect(commandRegistry[0]).toBe(cmd1);
			expect(commandRegistry[1]).toBe(cmd2);
		});
	});

	describe("commandRegistry", () => {
		it("should be an empty array initially", () => {
			expect(commandRegistry).toEqual([]);
		});

		it("should be mutable", () => {
			const metadata: CommandMetadata = {
				name: "test",
				description: "Test",
				handler: vi.fn(),
			};

			commandRegistry.push(metadata);

			expect(commandRegistry).toHaveLength(1);
		});
	});
});
