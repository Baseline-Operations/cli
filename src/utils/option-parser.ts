/**
 * Option parsing utilities for CLI commands.
 * Provides consistent option handling with defaults, validation, and normalization.
 */

/**
 * Options for parsing string options.
 */
export interface StringOptionOptions {
	/** Default value if option is undefined or empty */
	default?: string;
	/** Allowed values (enum validation) */
	allowedValues?: readonly string[];
	/** Whether to trim the value */
	trim?: boolean;
}

/**
 * Parse a string option with default value and optional validation.
 * 
 * @param value - The option value (may be undefined, null, or empty string)
 * @param options - Parsing options
 * @returns The parsed value or default
 * @throws Error if value is not in allowedValues (if specified)
 * 
 * @example
 * ```ts
 * // With default
 * const strategy = parseStringOption(options.strategy, { default: "latest" });
 * 
 * // With enum validation
 * const strategy = parseStringOption(options.strategy, {
 *   default: "latest",
 *   allowedValues: ["latest", "major", "minor", "patch"] as const
 * });
 * ```
 */
export function parseStringOption(
	value: string | undefined | null,
	options: StringOptionOptions = {}
): string {
	const { default: defaultValue = "", allowedValues, trim = true } = options;

	// Handle undefined/null/empty
	if (!value) {
		return defaultValue;
	}

	// Trim if requested
	const parsed = trim ? value.trim() : value;

	// Handle empty after trim
	if (parsed === "") {
		return defaultValue;
	}

	// Validate against allowed values if specified
	if (allowedValues && !allowedValues.includes(parsed)) {
		throw new Error(
			`Invalid option value: "${parsed}". Allowed values: ${allowedValues.join(", ")}`
		);
	}

	return parsed;
}

/**
 * Parse a boolean option with default value.
 * 
 * @param value - The option value (may be undefined, null, or boolean)
 * @param defaultValue - Default value if option is undefined or null
 * @returns The parsed boolean value
 * 
 * @example
 * ```ts
 * const parallel = parseBooleanOption(options.parallel, false);
 * ```
 */
export function parseBooleanOption(
	value: boolean | undefined | null,
	defaultValue: boolean = false
): boolean {
	if (value === undefined || value === null) {
		return defaultValue;
	}
	return Boolean(value);
}

/**
 * Parse a number option with default value and optional validation.
 * 
 * @param value - The option value (may be undefined, null, string, or number)
 * @param options - Parsing options
 * @returns The parsed number or default
 * @throws Error if value cannot be parsed as number or is outside range
 * 
 * @example
 * ```ts
 * // With default
 * const maxAttempts = parseNumberOption(options.maxAttempts, { default: 3 });
 * 
 * // With range validation
 * const maxAttempts = parseNumberOption(options.maxAttempts, {
 *   default: 3,
 *   min: 1,
 *   max: 10
 * });
 * ```
 */
export interface NumberOptionOptions {
	/** Default value if option is undefined or null */
	default?: number;
	/** Minimum allowed value */
	min?: number;
	/** Maximum allowed value */
	max?: number;
}

export function parseNumberOption(
	value: number | string | undefined | null,
	options: NumberOptionOptions = {}
): number {
	const { default: defaultValue = 0, min, max } = options;

	// Handle undefined/null
	if (value === undefined || value === null) {
		return defaultValue;
	}

	// Parse to number
	const parsed = typeof value === "string" ? Number(value) : value;

	// Validate is a number
	if (Number.isNaN(parsed)) {
		throw new Error(`Invalid number option: "${value}"`);
	}

	// Validate range
	if (min !== undefined && parsed < min) {
		throw new Error(`Number option must be >= ${min}, got ${parsed}`);
	}

	if (max !== undefined && parsed > max) {
		throw new Error(`Number option must be <= ${max}, got ${parsed}`);
	}

	return parsed;
}

/**
 * Parse an array option with optional filtering and validation.
 * 
 * @param value - The option value (may be undefined, null, string, or array)
 * @param options - Parsing options
 * @returns The parsed array or default
 * 
 * @example
 * ```ts
 * // With default
 * const dependencies = parseArrayOption(options.dependencies, { default: [] });
 * 
 * // From comma-separated string
 * const dependencies = parseArrayOption("pkg1,pkg2", { separator: "," });
 * ```
 */
export interface ArrayOptionOptions {
	/** Default value if option is undefined or null */
	default?: string[];
	/** Separator for string input (default: comma) */
	separator?: string | RegExp;
	/** Whether to filter empty values */
	filterEmpty?: boolean;
	/** Whether to trim values */
	trim?: boolean;
}

export function parseArrayOption(
	value: string[] | string | undefined | null,
	options: ArrayOptionOptions = {}
): string[] {
	const {
		default: defaultValue = [],
		separator = ",",
		filterEmpty = true,
		trim = true,
	} = options;

	// Handle undefined/null
	if (value === undefined || value === null) {
		return defaultValue;
	}

	// Convert string to array if needed
	let array: string[] = Array.isArray(value) ? value : [value];

	// Split by separator if value is a string containing the separator
	if (typeof value === "string" && value.includes(separator as string)) {
		array = value.split(separator);
	}

	// Process array items
	let result = array.map((item) => (trim ? String(item).trim() : String(item)));

	// Filter empty values if requested
	if (filterEmpty) {
		result = result.filter((item) => item !== "");
	}

	return result.length > 0 ? result : defaultValue;
}
