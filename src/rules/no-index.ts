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
		return {
			Program(node) {
				const filename = context.filename;
				const absoluteFilename = path.resolve(filename);
				const parsed = parseFilename(absoluteFilename);
				const shouldIgnore = isIgnoredFilename(filename);
				const isIndex = isIndexFile(parsed);

				if (shouldIgnore || !isIndex) return;

				context.report({ node, messageId: "notAllowed" });
			},
		};
	},
});
