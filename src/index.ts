// eslint-disable-next-line filenames/match-exported
import matchExported from "./rules/match-exported.js";
import matchRegex from "./rules/match-regex.js";
import noIndex from "./rules/no-index.js";

import type { ESLint } from "eslint";

const plugin: ESLint.Plugin = {
	meta: {
		name: PLUGIN_NAME,
		version: PLUGIN_VERSION,
	},
	rules: {
		"match-exported": matchExported,
		"match-regex": matchRegex,
		"no-index": noIndex,
	},
};

export default plugin;

// defined at build time: see tsup config
declare const PLUGIN_NAME: string;
declare const PLUGIN_VERSION: string;
