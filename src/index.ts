import matchExported from "./rules/match-exported.js";
import matchRegex from "./rules/match-regex.js";
import noIndex from "./rules/no-index.js";

import type { ESLint, Rule } from "eslint";

export default {
	meta: {
		name: "@kavsingh/eslint-plugin-filenames",
		version: "2.0.0-alpha.0",
	},
	// TODO: see if @typescript-eslint/utils resolves type issues
	rules: {
		"match-exported": matchExported as unknown as Rule.RuleModule,
		"match-regex": matchRegex as unknown as Rule.RuleModule,
		"no-index": noIndex as unknown as Rule.RuleModule,
	},
} as const satisfies ESLint.Plugin;
