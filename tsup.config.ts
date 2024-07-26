import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/index.ts"],
	format: ["cjs", "esm"],
	target: "node18",
	splitting: true,
	shims: true,
	dts: true,
	clean: true,
});
