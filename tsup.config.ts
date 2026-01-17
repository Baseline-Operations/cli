import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/cli.ts"],
	format: ["esm"],
	target: "node20",
	dts: false,
	sourcemap: true,
	clean: true,
	bundle: true, // Bundle into single file for CLI
	// Shebang handled by package.json bin entry for ESM
});
