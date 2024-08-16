/**
 * @fileoverview Rule to ensure that there exist no index files
 * @author Stefan Lau
 * @author Kav Singh
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

import path from "node:path";

import parseFilename from "../lib/parse-filename.js";
import isIgnoredFilename from "../lib/is-ignored-filename.js";

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
		const filename = context.filename;
		const parsed = parseFilename(path.resolve(filename));
		const isIndex = parsed.isIndex && !isIgnoredFilename(filename);

		return {
			Program(node) {
				if (isIndex) {
					context.report({ node, messageId: "notAllowed" });
				}
			},
		};
	},
};

export default noIndex;
