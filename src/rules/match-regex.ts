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
					ignoreDefaultExport: { type: "boolean" },
				},
			},
		],
		messages: {
			doesNotMatch: "Filename '{{name}}' does not match the naming convention.",
		},
	},
	defaultOptions: [
		undefined as string | undefined,
		undefined as { ignoreDefaultExport?: boolean | undefined } | undefined,
	],
	create(context) {
		const filename = context.filename;
		const shouldIgnore = isIgnoredFilename(filename);
		const parsed = parseFilename(filename);
		const options = context.options[1];

		const regexp = context.options[0]
			? new RegExp(context.options[0])
			: /^([a-z0-9]+)([A-Z][a-z0-9]+)*$/g;

		const ignoreDefaultExport = options ? !!options.ignoreDefaultExport : false;

		return {
			Program(node) {
				if (shouldIgnore) return;
				if (regexp.test(parsed.name)) return;
				if (ignoreDefaultExport && getExportedName(node)) return;

				context.report({
					node,
					messageId: "doesNotMatch",
					data: { name: parsed.base },
				});
			},
		};
	},
});
