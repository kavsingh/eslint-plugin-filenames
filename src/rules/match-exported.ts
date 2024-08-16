/**
 * @fileoverview Rule to ensure that filenames match the exports of the file
 * @author Stefan Lau
 * @author Kav Singh
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

import path from "node:path";

import camelCase from "lodash.camelcase";
import kebabCase from "lodash.kebabcase";
import snakeCase from "lodash.snakecase";
import upperFirst from "lodash.upperfirst";

import getDefaultExportName from "../lib/get-default-export-name.js";
import parseFilename from "../lib/parse-filename.js";
import readProp from "../lib/read-prop.js";

import type { Rule } from "eslint";
import type { ParsedFilename } from "../lib/parse-filename.js";

const TRANSFORMERS: Record<string, Transformer> = {
	kebab: kebabCase,
	snake: snakeCase,
	camel: camelCase,
	pascal: (value: string) => upperFirst(camelCase(value)),
};

type Transformer = (value: string) => string;

const matchExported: Rule.RuleModule = {
	meta: {
		type: "problem",
		docs: {
			description: "Ensure that filenames match the exports of the file",
			url: "https://github.com/kavsingh/eslint-plugin-filenames?tab=readme-ov-file#match-exported",
		},
		schema: [
			{
				type: "object",
				properties: {
					transforms: {
						type: "array",
						items: [{ type: "string" }],
					},
					remove: { type: "string" },
					matchExportedFunctionCall: { type: "boolean" },
				},
			},
		],
		messages: {
			normalFile:
				"Filename '{{expectedExport}}' must match {{whatToMatch}} '{{exportName}}'.",
			indexFile:
				"The directory '{{expectedExport}}' must be named '{{exportName}}', after the exported value of its index file.",
		},
	},
	create(context) {
		const parsed = parseFilename(context.filename);

		const options: unknown = context.options[0];
		const remove = readProp(options, "remove");
		const transforms = readProp(options, "transforms");
		const matchExportedFunctionCall = !!readProp(
			options,
			"matchExportedFunctionCall",
		);

		const expectedName = getExpectedName(
			parsed,
			remove && typeof remove === "string" ? new RegExp(remove) : undefined,
		);

		const transformerNames = Array.isArray(transforms)
			? transforms.filter((item) => typeof item === "string")
			: [];

		return {
			Program(node) {
				const exportedName = getDefaultExportName(
					node,
					matchExportedFunctionCall,
				);

				if (!exportedName) {
					return;
				}

				if (parsed.isIndex && exportedName === "index") {
					return;
				}

				const candidateNames = getCanditateNames(
					exportedName,
					transformerNames,
				);

				if (candidateNames.some((name) => name === expectedName)) {
					return;
				}

				let whatToMatch = "the exported name";

				if (transformerNames.length) {
					whatToMatch =
						transformerNames.length === 1
							? "the exported and transformed name"
							: "any of the exported and transformed names";
				}

				context.report({
					node,
					messageId: parsed.isIndex ? "indexFile" : "normalFile",
					data: {
						whatToMatch,
						name: parsed.base,
						expectedExport: expectedName,
						exportName: candidateNames.join("', '"),
						extension: parsed.ext,
					},
				});
			},
		};
	},
};

export default matchExported;

function getCanditateNames(
	name: string | undefined,
	transformerNames: string[],
) {
	if (!name) return [];
	if (!transformerNames.length) return [name];

	const result = [];

	for (const transformerName of transformerNames) {
		const transformer = TRANSFORMERS[transformerName];

		if (transformer) result.push(transformer(name));
	}

	return result;
}

function getExpectedName(
	parsed: ParsedFilename,
	replacePattern?: RegExp | undefined,
): string {
	const dirArray = parsed.dir.split(path.sep);
	const lastDirectory = dirArray[dirArray.length - 1];

	if (parsed.isIndex && lastDirectory) {
		return lastDirectory;
	}

	if (!replacePattern) {
		return parsed.name;
	}

	replacePattern.lastIndex = 0;

	return parsed.name.replace(replacePattern, "");
}
