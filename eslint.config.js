import js from "@eslint/js";
// @ts-expect-error no-types-available
import eslintPlugin from "eslint-plugin-eslint-plugin";
import nodePlugin from "eslint-plugin-n";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import globals from "globals";
import tsEslint from "typescript-eslint";

import self from "./dist/index.js";

export default tsEslint.config(
	{ ignores: [".vscode/*", "dist/*", "build/*"] },
	{
		linterOptions: { reportUnusedDisableDirectives: true },
		languageOptions: {
			globals: { ...globals.node },
			parserOptions: { projectService: true },
		},
	},
	js.configs.recommended,
	...tsEslint.configs.strictTypeChecked,
	...tsEslint.configs.stylisticTypeChecked,
	nodePlugin.configs["flat/recommended-module"],
	{
		settings: { node: { version: ">=20.0.0" } },
		plugins: { filenames: self },
		rules: {
			"@typescript-eslint/consistent-type-definitions": ["error", "type"],
			"@typescript-eslint/consistent-type-imports": "error",
			"filenames/match-regex": [
				"error",
				"^[a-z0-9-.]+$",
				{ ignoreExported: true },
			],
			"filenames/match-exported": [
				"error",
				{ transforms: ["kebab"], removeRegex: "\\.test$" },
			],
		},
	},
	{
		files: ["*.cjs", "*.cts"],
		languageOptions: { parserOptions: { sourceType: "script" } },
	},
	{
		files: ["./src/rules"],
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		extends: [
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			eslintPlugin.configs["flat/recommended"],
		],
	},
	eslintPluginPrettierRecommended,
);
