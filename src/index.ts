// eslint-disable-next-line filenames/match-exported
import matchExported from "./rules/match-exported.js";
import matchRegex from "./rules/match-regex.js";
import noIndex from "./rules/no-index.js";

import type { ESLint, Rule } from "eslint";

const plugin: ESLint.Plugin = {
	meta: {
		name: PLUGIN_NAME,
		version: PLUGIN_VERSION,
	},
	rules: {
		"match-exported": matchExported as unknown as Rule.RuleModule,
		"match-regex": matchRegex as unknown as Rule.RuleModule,
		"no-index": noIndex as unknown as Rule.RuleModule,
	},
};

export default plugin;

declare const PLUGIN_NAME: string;
declare const PLUGIN_VERSION: string;
