import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import eslintPlugin from "eslint-plugin-eslint-plugin";
import n from "eslint-plugin-n";
import prettierRecommended from "eslint-plugin-prettier/recommended";
import globals from "globals";
import tsEslint from "typescript-eslint";

import self from "./dist/index.js";

export default defineConfig(
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
	self.configs.kebab,
	n.configs["flat/recommended-module"],

	{
		rules: {
			"@typescript-eslint/consistent-type-definitions": ["error", "type"],
			"@typescript-eslint/consistent-type-imports": "error",
		},
	},

	{
		files: ["*.js"],
		rules: {
			"filenames/match-exported": "off",
		},
	},

	{
		files: ["src/**/*.test.ts"],
		rules: {
			"n/no-unsupported-features/node-builtins": [
				"error",
				{ version: ">=22", allowExperimental: true },
			],
		},
	},

	{
		files: ["src/rules/**/*.ts"],
		extends: [eslintPlugin.configs.recommended],
	},

	prettierRecommended,
);
