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
			indexFile:
				"The directory '{{exportingFileName}}' must be named '{{candidateFileNames}}', after the exported value of its index file.",
			noTransform:
				"Filename '{{exportingFileName}}' must match the exported name '{{candidateFileNames}}'.",
			singleTransform:
				"Filename '{{exportingFileName}}' must match the exported and transformed name '{{candidateFileNames}}'.",
			multipleTransforms:
				"Filename '{{exportingFileName}}' must match any of the exported and transformed names '{{candidateFileNames}}'.",
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

		const exportingFileName = getExportingFileName(
			parsed,
			remove && typeof remove === "string" ? new RegExp(remove) : undefined,
		);

		const transformerNames = Array.isArray(transforms)
			? transforms.filter((item) => typeof item === "string")
			: [];

		return {
			Program(node) {
				if (parsed.shouldIgnore) {
					return;
				}

				const defaultExportName = getDefaultExportName(
					node,
					matchExportedFunctionCall,
				);

				if (!defaultExportName) {
					return;
				}

				if (parsed.isIndex && defaultExportName === "index") {
					return;
				}

				const candidateFileNames = getCanditateFileNames(
					defaultExportName,
					transformerNames,
				);

				if (candidateFileNames.some((name) => name === exportingFileName)) {
					return;
				}

				let messageId = "multipleTransforms";
				if (parsed.isIndex) {
					messageId = "indexFile";
				} else if (!transformerNames.length) {
					messageId = "noTransform";
				} else if (transformerNames.length === 1) {
					messageId = "singleTransform";
				}

				context.report({
					node,
					messageId,
					data: {
						exportingFileName,
						candidateFileNames: candidateFileNames.join("', '"),
					},
				});
			},
		};
	},
};

export default matchExported;

function getExportingFileName(
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

function getCanditateFileNames(
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
