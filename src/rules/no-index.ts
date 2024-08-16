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
import isIndexFile from "../lib/is-index-file.js";

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
			notAllowed: "'index.js' files are not allowed.",
		},
	},
	create(context) {
		const filename = context.filename;
		const parsed = parseFilename(path.resolve(filename));
		const isIndex = isIndexFile(parsed) && !isIgnoredFilename(filename);

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
