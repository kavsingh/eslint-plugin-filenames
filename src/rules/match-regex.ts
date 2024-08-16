/**
 * @fileoverview Rule to ensure that filenames match a convention (default: camelCase)
 * @author Stefan Lau
 * @author Kav Singh
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

import parseFilename from "../lib/parse-filename.js";
import getDefaultExportName from "../lib/get-default-export-name.js";
import readProp from "../lib/read-prop.js";

import type { Rule } from "eslint";

const matchRegex: Rule.RuleModule = {
	meta: {
		type: "problem",
		docs: {
			description:
				"Enforce a file naming convention via regex (default: camelCase)",
			url: `https://github.com/kavsingh/eslint-plugin-filenames?tab=readme-ov-file#match-regex`,
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
	create(context) {
		const parsed = parseFilename(context.filename);

		const regexp =
			typeof context.options[0] === "string"
				? new RegExp(context.options[0])
				: /^([a-z0-9]+)([A-Z][a-z0-9]+)*$/g;
		const nameMatchesRegex = regexp.test(parsed.name);

		const ignoreDefaultExport = !!readProp(
			context.options[1],
			"ignoreDefaultExport",
		);

		return {
			Program(node) {
				if (parsed.shouldIgnore) {
					return;
				}

				if (ignoreDefaultExport && getDefaultExportName(node)) {
					return;
				}

				if (nameMatchesRegex) {
					return;
				}

				context.report({
					node,
					messageId: "doesNotMatch",
					data: { name: parsed.name },
				});
			},
		};
	},
};

export default matchRegex;
