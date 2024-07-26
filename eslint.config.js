import js from "@eslint/js";
import globals from "globals";
import tsEslint from "typescript-eslint";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default tsEslint.config(
	{ ignores: [".vscode/*", "dist/*", "build/*"] },
	{
		linterOptions: { reportUnusedDisableDirectives: true },
		languageOptions: {
			globals: { ...globals.node },
			parserOptions: { project: true },
		},
	},
	js.configs.recommended,
	...tsEslint.configs.strictTypeChecked,
	...tsEslint.configs.stylisticTypeChecked,
	{
		rules: {
			"@typescript-eslint/consistent-type-definitions": ["error", "type"],
			"@typescript-eslint/consistent-type-imports": "error",
		},
	},
	{
		files: ["*.cjs", "*.cts"],
		languageOptions: { parserOptions: { sourceType: "script" } },
	},
	// @ts-expect-error upstream types
	eslintPluginPrettierRecommended,
);
