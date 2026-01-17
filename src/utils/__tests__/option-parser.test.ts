import { describe, it, expect } from "vitest";
import {
	parseStringOption,
	parseBooleanOption,
	parseNumberOption,
	parseArrayOption,
} from "../option-parser";

describe("option-parser", () => {
	describe("parseStringOption", () => {
		it("should return default value when value is undefined", () => {
			expect(parseStringOption(undefined, { default: "latest" })).toBe("latest");
		});

		it("should return default value when value is null", () => {
			expect(parseStringOption(null, { default: "latest" })).toBe("latest");
		});

		it("should return default value when value is empty string", () => {
			expect(parseStringOption("", { default: "latest" })).toBe("latest");
		});

		it("should return default value when value is whitespace only", () => {
			expect(parseStringOption("   ", { default: "latest" })).toBe("latest");
		});

		it("should return trimmed value when value is provided", () => {
			expect(parseStringOption("  patch  ", { default: "latest" })).toBe("patch");
		});

		it("should not trim when trim option is false", () => {
			expect(parseStringOption("  patch  ", { default: "latest", trim: false })).toBe(
				"  patch  "
			);
		});

		it("should return empty string as default when no default specified", () => {
			expect(parseStringOption(undefined)).toBe("");
		});

		it("should validate against allowed values", () => {
			const allowedValues = ["latest", "major", "minor", "patch"] as const;
			expect(
				parseStringOption("latest", { allowedValues, default: "latest" })
			).toBe("latest");
			expect(
				parseStringOption("major", { allowedValues, default: "latest" })
			).toBe("major");
		});

		it("should throw error when value is not in allowed values", () => {
			const allowedValues = ["latest", "major", "minor", "patch"] as const;
			expect(() => {
				parseStringOption("invalid", { allowedValues, default: "latest" });
			}).toThrow('Invalid option value: "invalid". Allowed values: latest, major, minor, patch');
		});
	});

	describe("parseBooleanOption", () => {
		it("should return default value when value is undefined", () => {
			expect(parseBooleanOption(undefined, false)).toBe(false);
			expect(parseBooleanOption(undefined, true)).toBe(true);
		});

		it("should return default value when value is null", () => {
			expect(parseBooleanOption(null, false)).toBe(false);
		});

		it("should return true when value is true", () => {
			expect(parseBooleanOption(true, false)).toBe(true);
		});

		it("should return false when value is false", () => {
			expect(parseBooleanOption(false, true)).toBe(false);
		});

		it("should default to false when no default specified", () => {
			expect(parseBooleanOption(undefined)).toBe(false);
		});
	});

	describe("parseNumberOption", () => {
		it("should return default value when value is undefined", () => {
			expect(parseNumberOption(undefined, { default: 3 })).toBe(3);
		});

		it("should return default value when value is null", () => {
			expect(parseNumberOption(null, { default: 5 })).toBe(5);
		});

		it("should parse number from string", () => {
			expect(parseNumberOption("42", { default: 0 })).toBe(42);
		});

		it("should return number when value is already a number", () => {
			expect(parseNumberOption(42, { default: 0 })).toBe(42);
		});

		it("should throw error when value cannot be parsed as number", () => {
			expect(() => {
				parseNumberOption("not-a-number", { default: 0 });
			}).toThrow('Invalid number option: "not-a-number"');
		});

		it("should validate minimum value", () => {
			expect(parseNumberOption(5, { default: 0, min: 1 })).toBe(5);
			expect(() => {
				parseNumberOption(0, { default: 0, min: 1 });
			}).toThrow("Number option must be >= 1, got 0");
		});

		it("should validate maximum value", () => {
			expect(parseNumberOption(5, { default: 0, max: 10 })).toBe(5);
			expect(() => {
				parseNumberOption(15, { default: 0, max: 10 });
			}).toThrow("Number option must be <= 10, got 15");
		});

		it("should default to 0 when no default specified", () => {
			expect(parseNumberOption(undefined)).toBe(0);
		});
	});

	describe("parseArrayOption", () => {
		it("should return default value when value is undefined", () => {
			expect(parseArrayOption(undefined, { default: [] })).toEqual([]);
		});

		it("should return default value when value is null", () => {
			expect(parseArrayOption(null, { default: ["default"] })).toEqual(["default"]);
		});

		it("should return array when value is already an array", () => {
			expect(parseArrayOption(["a", "b", "c"])).toEqual(["a", "b", "c"]);
		});

		it("should split string by comma by default", () => {
			expect(parseArrayOption("a,b,c")).toEqual(["a", "b", "c"]);
		});

		it("should split string by custom separator", () => {
			expect(parseArrayOption("a|b|c", { separator: "|" })).toEqual(["a", "b", "c"]);
		});

		it("should trim array values by default", () => {
			expect(parseArrayOption("a , b , c")).toEqual(["a", "b", "c"]);
		});

		it("should filter empty values by default", () => {
			expect(parseArrayOption("a,,b,c")).toEqual(["a", "b", "c"]);
		});

		it("should not filter empty values when filterEmpty is false", () => {
			expect(parseArrayOption("a,,b", { filterEmpty: false })).toEqual(["a", "", "b"]);
		});

		it("should return default when array is empty after filtering", () => {
			expect(parseArrayOption("  , , ", { default: ["default"] })).toEqual(["default"]);
		});

		it("should handle single string value (no separator)", () => {
			expect(parseArrayOption("single")).toEqual(["single"]);
		});
	});
});
