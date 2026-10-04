import { defineConfig } from "tsdown";

import packageJson from "./package.json" with { type: "json" };

export default defineConfig({
	entry: ["src/index.ts"],
	format: ["cjs", "esm"],
	platform: "node",
	target: "node20",
	dts: { build: true },
	clean: true,
	define: {
		PLUGIN_NAME: JSON.stringify(packageJson.name),
		PLUGIN_VERSION: JSON.stringify(packageJson.version),
	},
});
