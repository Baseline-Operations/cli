/**
 * Tests for workspace graph command wrapper.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { graphCommand } from "../graph";
import * as coreCommands from "@baseline/core/commands";
import { Logger } from "../../../utils/logger";

// Mock dependencies
vi.mock("@baseline/core/commands", () => ({
	generateGraph: vi.fn(),
}));

vi.mock("../../../utils/logger", () => ({
	Logger: {
		title: vi.fn(),
		success: vi.fn(),
		error: vi.fn(),
		info: vi.fn(),
		warn: vi.fn(),
		log: vi.fn(),
	},
}));

describe("graphCommand", () => {
	let originalExit: typeof process.exit;
	let exitSpy: any;

	beforeEach(() => {
		vi.clearAllMocks();

		// Mock process.exit
		originalExit = process.exit;
		exitSpy = vi.fn();
		process.exit = exitSpy as any;
	});

	afterEach(() => {
		process.exit = originalExit;
		vi.restoreAllMocks();
	});

	it("should call core generateGraph and display messages", async () => {
		vi.mocked(coreCommands.generateGraph).mockResolvedValue({
			success: true,
			messages: [
				{ type: "info", message: "Dependency Graph" },
				{ type: "info", message: "\ngraph output\n" },
			],
		});

		await graphCommand({});

		expect(coreCommands.generateGraph).toHaveBeenCalledWith({});
		expect(Logger.title).toHaveBeenCalledWith("Dependency Graph");
		expect(Logger.log).toHaveBeenCalledWith("\ngraph output\n");
	});

	it("should pass options to core command", async () => {
		vi.mocked(coreCommands.generateGraph).mockResolvedValue({
			success: true,
			messages: [],
		});

		const options = { format: "json" as const, output: "graph.json" };
		await graphCommand(options);

		expect(coreCommands.generateGraph).toHaveBeenCalledWith(options);
	});

	it("should handle errors and exit with code 1", async () => {
		vi.mocked(coreCommands.generateGraph).mockResolvedValue({
			success: false,
			messages: [{ type: "error", message: "Failed to generate graph" }],
		});

		await graphCommand({});

		expect(Logger.error).toHaveBeenCalledWith("Failed to generate graph");
		expect(exitSpy).toHaveBeenCalledWith(1);
	});
});
