/**
 * Tests for workspace setup command wrapper.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { setupCommand } from "../setup";
import { configCommand } from "../config";
import { projectInitCommand } from "../project-init";

// Mock dependencies
vi.mock("../config", () => ({
	configCommand: vi.fn(),
}));

vi.mock("../project-init", () => ({
	projectInitCommand: vi.fn(),
}));

describe("setupCommand", () => {
	let originalExit: typeof process.exit;
	let exitSpy: any;
	let originalConsoleError: typeof console.error;

	beforeEach(() => {
		vi.clearAllMocks();

		// Mock process.exit
		originalExit = process.exit;
		exitSpy = vi.fn();
		process.exit = exitSpy as any;

		// Mock console.error
		originalConsoleError = console.error;
		console.error = vi.fn();
	});

	afterEach(() => {
		process.exit = originalExit;
		console.error = originalConsoleError;
		vi.restoreAllMocks();
	});

	it("should call configCommand and projectInitCommand", async () => {
		vi.mocked(configCommand).mockResolvedValue(undefined);
		vi.mocked(projectInitCommand).mockResolvedValue(undefined);

		await setupCommand({});

		expect(configCommand).toHaveBeenCalledWith({});
		expect(projectInitCommand).toHaveBeenCalledWith({});
		expect(exitSpy).not.toHaveBeenCalled();
	});

	it("should pass force option to both commands", async () => {
		vi.mocked(configCommand).mockResolvedValue(undefined);
		vi.mocked(projectInitCommand).mockResolvedValue(undefined);

		await setupCommand({ force: true });

		expect(configCommand).toHaveBeenCalledWith({ force: true });
		expect(projectInitCommand).toHaveBeenCalledWith({ force: true });
	});

	it("should handle errors and exit with code 1", async () => {
		const error = new Error("Setup failed");
		vi.mocked(configCommand).mockRejectedValue(error);

		await setupCommand({});

		expect(console.error).toHaveBeenCalledWith("Error: Setup failed");
		expect(exitSpy).toHaveBeenCalledWith(1);
	});
});
