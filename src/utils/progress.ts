/**
 * Progress indicator utilities for CLI operations.
 * Provides spinners for long-running operations.
 */

import ora, { type Ora } from "ora";

/**
 * Check if output is to a terminal (TTY).
 */
export function isTerminal(): boolean {
	return process.stdout.isTTY === true;
}

/**
 * Create a progress spinner.
 * Returns null if not in terminal environment.
 */
export function createSpinner(text: string): Ora | null {
	if (!isTerminal()) {
		return null;
	}
	return ora(text).start();
}

/**
 * Update spinner text.
 */
export function updateSpinner(spinner: Ora | null, text: string): void {
	if (spinner) {
		spinner.text = text;
	}
}

/**
 * Stop spinner with success.
 */
export function succeedSpinner(spinner: Ora | null, text?: string): void {
	if (spinner) {
		if (text) {
			spinner.succeed(text);
		} else {
			spinner.succeed();
		}
	}
}

/**
 * Stop spinner with failure.
 */
export function failSpinner(spinner: Ora | null, text?: string): void {
	if (spinner) {
		if (text) {
			spinner.fail(text);
		} else {
			spinner.fail();
		}
	}
}

/**
 * Stop spinner without status change.
 */
export function stopSpinner(spinner: Ora | null): void {
	if (spinner) {
		spinner.stop();
	}
}
