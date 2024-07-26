/**
 * @fileoverview Rule to ensure that there exist no index files
 * @author Stefan Lau
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

import path from "node:path";

import { ESLintUtils } from "@typescript-eslint/utils";

import parseFilename from "../lib/parse-filename.js";
import isIgnoredFilename from "../lib/is-ignored-filename.js";
import isIndexFile from "../lib/is-index-file.js";

const createRule = ESLintUtils.RuleCreator((name) => {
	return `https://github.com/kavsingh/eslint-plugin-filenames?tab=readme-ov-file#${name}`;
});

export default createRule({
	name: "no-index",
	meta: {
		type: "problem",
		docs: {
			description: "Ensure no index files are used",
		},
		schema: [],
		messages: {
			notAllowed: "'index.js' files are not allowed.",
		},
	},
	defaultOptions: [],
	create(context) {
		const filename = context.filename;
		const parsed = parseFilename(path.resolve(filename));
		const shouldIgnore = isIgnoredFilename(filename);

		return {
			Program(node) {
				if (shouldIgnore || !isIndexFile(parsed)) return;

				context.report({ node, messageId: "notAllowed" });
			},
		};
	},
});
