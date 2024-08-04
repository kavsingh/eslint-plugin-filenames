import { defineConfig } from "tsup";

import packageJson from "./package.json";

export default defineConfig({
	entry: ["src/index.ts"],
	format: ["cjs", "esm"],
	target: "node18",
	splitting: true,
	shims: true,
	dts: true,
	clean: true,
	sourcemap: true,
	esbuildOptions(options) {
		options.define ??= {};
		options.define["PLUGIN_NAME"] = JSON.stringify(packageJson.name);
		options.define["PLUGIN_VERSION"] = JSON.stringify(packageJson.version);
	},
});
