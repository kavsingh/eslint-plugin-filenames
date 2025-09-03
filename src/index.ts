/* node:coverage disable */

import {
	REGEXP_CAMEL_CASE,
	REGEXP_KEBAB_CASE,
	REGEXP_SNAKE_CASE,
} from "./lib/constants.ts";
import matchExported from "./rules/match-exported.ts";
import matchRegex from "./rules/match-regex.ts";
import noIndex from "./rules/no-index.ts";

import type { ESLint } from "eslint";

const plugin = {
	meta: {
		name: PLUGIN_NAME,
		version: PLUGIN_VERSION,
	},
	rules: {
		"match-exported": matchExported,
		"match-regex": matchRegex,
		"no-index": noIndex,
	},
} satisfies ESLint.Plugin;

const configs = {
	kebab: {
		name: "eslint-plugin-filenames/kebab",
		plugins: { filenames: plugin },
		rules: {
			"filenames/match-regex": [
				"error",
				REGEXP_KEBAB_CASE,
				{ ignoreDefaultExport: true },
			],
			"filenames/match-exported": ["error", { transforms: ["kebab"] }],
		},
	},
	snake: {
		name: "eslint-plugin-filenames/snake",
		plugins: { filenames: plugin },
		rules: {
			"filenames/match-regex": [
				"error",
				REGEXP_SNAKE_CASE,
				{ ignoreDefaultExport: true },
			],
			"filenames/match-exported": ["error", { transforms: ["snake"] }],
		},
	},
	camel: {
		name: "eslint-plugin-filenames/camel",
		plugins: { filenames: plugin },
		rules: {
			"filenames/match-regex": [
				"error",
				REGEXP_CAMEL_CASE,
				{ ignoreDefaultExport: true },
			],
			"filenames/match-exported": [
				"error",
				{ transforms: ["camel", "pascal"] },
			],
		},
	},
} satisfies ESLint.Plugin["configs"];

export default { ...plugin, configs };
