/**
 * @fileoverview Rule to ensure that filenames match a convention (default: camelCase)
 * @author Stefan Lau
 * @author Kav Singh
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

import parseFilename from "../lib/parse-filename.ts";
import getDefaultExportName from "../lib/get-default-export-name.ts";
import readProp from "../lib/read-prop.ts";

import type { Rule } from "eslint";
import { REGEXP_CAMEL_CASE } from "../lib/constants.ts";

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
				description: "Regex expression as string",
			},
			{
				type: "object",
				properties: {
					ignoreDefaultExport: {
						type: "boolean",
						description: "Ignore named default export",
					},
				},
			},
		],
		defaultOptions: [REGEXP_CAMEL_CASE, { ignoreDefaultExport: false }],
		messages: {
			doesNotMatch: "Filename '{{name}}' does not match the naming convention.",
		},
	},
	create(context) {
		const parsed = parseFilename(context.filename);
		const regexp = new RegExp(
			typeof context.options[0] === "string"
				? context.options[0]
				: REGEXP_CAMEL_CASE,
		);
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
