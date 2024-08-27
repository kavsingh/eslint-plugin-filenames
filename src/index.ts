/* node:coverage disable */

import matchExported from "./rules/match-exported.js";
import matchRegex from "./rules/match-regex.js";
import noIndex from "./rules/no-index.js";

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
				"^[a-z0-9-.]+$",
				{ ignoreExported: true },
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
				"^[a-z0-9_.]+$",
				{ ignoreExported: true },
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
				"^[a-zA-Z0-9.]+$",
				{ ignoreExported: true },
			],
			"filenames/match-exported": [
				"error",
				{ transforms: ["camel", "pascal"] },
			],
		},
	},
} satisfies ESLint.Plugin["configs"];

export default { ...plugin, configs };

// defined at build time: see tsup config
declare const PLUGIN_NAME: string;
declare const PLUGIN_VERSION: string;
