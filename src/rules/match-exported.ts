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

import getExportedName from "../lib/get-exported-name.js";
import isIgnoredFilename from "../lib/is-ignored-filename.js";
import isIndexFile from "../lib/is-index-file.js";
import parseFilename from "../lib/parse-filename.js";
import readProp from "../lib/read-prop.js";

import type { Rule } from "eslint";
import type { ParsedFilename } from "../lib/parse-filename.js";

const TRANSFORMS: Record<string, Transform> = {
	kebab: kebabCase,
	snake: snakeCase,
	camel: camelCase,
	pascal: (value: string) => upperFirst(camelCase(value)),
};

type Transform = (value: string) => string;

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
		const filename = context.filename;
		const absoluteFilename = path.resolve(filename);
		const parsed = parseFilename(absoluteFilename);
		const shouldIgnore = isIgnoredFilename(filename);

		const options: unknown = context.options[0] ?? {};
		const remove = readProp(options, "remove");
		const transformsOption = readProp(options, "transforms");
		const matchExportedCall = !!readProp(options, "matchExportedFunctionCall");

		const expectedName = getStringToCheckAgainstExport(
			parsed,
			remove && typeof remove === "string" ? new RegExp(remove) : undefined,
		);

		const transforms: unknown[] = Array.isArray(transformsOption)
			? transformsOption
			: [];

		return {
			Program(node) {
				if (shouldIgnore) {
					return;
				}

				const exportedName = getExportedName(node, matchExportedCall);

				if (!exportedName) {
					return;
				}

				if (exportedName === "index" && parsed.name === "index") {
					return;
				}

				const transformedNames = transform(exportedName, transforms);

				if (transformedNames.some((name) => name === expectedName)) {
					return;
				}

				let whatToMatch = "the exported name";

				if (transforms.length) {
					whatToMatch =
						transforms.length === 1
							? "the exported and transformed name"
							: "any of the exported and transformed names";
				}

				context.report({
					node,
					messageId: isIndexFile(parsed) ? "indexFile" : "normalFile",
					data: {
						whatToMatch,
						name: parsed.base,
						expectedExport: expectedName,
						exportName: transformedNames.join("', '"),
						extension: parsed.ext,
					},
				});
			},
		};
	},
};

export default matchExported;

function transform(name: string | undefined, transformNames: unknown[]) {
	if (!name) return [];
	if (!transformNames.length) return [name];

	const result = [];

	for (const transformName of transformNames) {
		const transformer =
			typeof transformName === "string" ? TRANSFORMS[transformName] : undefined;

		if (transformer) result.push(transformer(name));
	}

	return result;
}

function getStringToCheckAgainstExport(
	parsed: ParsedFilename,
	replacePattern?: RegExp | undefined,
): string {
	const dirArray = parsed.dir.split(path.sep);
	const lastDirectory = dirArray[dirArray.length - 1];

	if (isIndexFile(parsed) && lastDirectory) {
		return lastDirectory;
	}

	if (!replacePattern) {
		return parsed.name;
	}

	replacePattern.lastIndex = 0;

	return parsed.name.replace(replacePattern, "");
}
