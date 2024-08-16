/**
 * @fileoverview Rule to ensure that there exist no index files
 * @author Stefan Lau
 * @author Kav Singh
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

import parseFilename from "../lib/parse-filename.js";

import type { Rule } from "eslint";

const noIndex: Rule.RuleModule = {
	meta: {
		type: "problem",
		docs: {
			description: "Ensure no index files are used",
			url: "https://github.com/kavsingh/eslint-plugin-filenames?tab=readme-ov-file#no-index",
		},
		schema: [],
		messages: {
			notAllowed: "index files are not allowed.",
		},
	},
	create(context) {
		const parsed = parseFilename(context.filename);

		return {
			Program(node) {
				if (parsed.shouldIgnore || !parsed.isIndex) {
					return;
				}

				context.report({ node, messageId: "notAllowed" });
			},
		};
	},
};

export default noIndex;
