/**
 * @fileoverview Rule to ensure that filenames match a convention (default: camelCase)
 * @author Stefan Lau
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

import { ESLintUtils } from "@typescript-eslint/utils";

import parseFilename from "../lib/parse-filename.js";
import getExportedName from "../lib/get-exported-name.js";
import isIgnoredFilename from "../lib/is-ignored-filename.js";

const createRule = ESLintUtils.RuleCreator((name) => {
	return `https://github.com/kavsingh/eslint-plugin-filenames?tab=readme-ov-file#${name}`;
});

export default createRule({
	name: "match-regex",
	meta: {
		type: "problem",
		docs: {
			description:
				"Enforce a file naming convention via regex (default: camelCase)",
		},
		schema: [
			{
				type: "string",
			},
			{
				type: "object",
				properties: {
					ignoreExported: { type: "boolean" },
				},
			},
		],
		messages: {
			doesNotMatch: "Filename '{{name}}' does not match the naming convention.",
		},
	},
	defaultOptions: [
		String(/^([a-z0-9]+)([A-Z][a-z0-9]+)*$/g),
		{ ignoreExported: false },
	],
	create(context) {
		const regexp = new RegExp(context.options[0]);
		const ignoreExported = !!context.options[1].ignoreExported;

		return {
			Program(node) {
				const filename = context.filename;

				if (isIgnoredFilename(filename)) return;

				const isExporting = !!getExportedName(node);

				if (ignoreExported && isExporting) return;

				const parsed = parseFilename(filename);

				if (regexp.test(parsed.name)) return;

				context.report({
					node,
					messageId: "doesNotMatch",
					data: { name: parsed.base },
				});
			},
		};
	},
});
