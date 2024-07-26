/**
 * @fileoverview Rule to ensure that filenames match the exports of the file
 * @author Stefan Lau
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

import path from "node:path";

import { ESLintUtils } from "@typescript-eslint/utils";
import camelCase from "lodash.camelcase";
import kebabCase from "lodash.kebabcase";
import snakeCase from "lodash.snakecase";
import upperFirst from "lodash.upperfirst";

import getExportedName from "../lib/get-exported-name.js";
import isIgnoredFilename from "../lib/is-ignored-filename.js";
import isIndexFile from "../lib/is-index-file.js";
import parseFilename from "../lib/parse-filename.js";

import type { ParsedFilename } from "../lib/parse-filename.js";

const createRule = ESLintUtils.RuleCreator((name) => {
	return `https://github.com/kavsingh/eslint-plugin-filenames?tab=readme-ov-file#${name}`;
});

const TRANSFORMS: Record<string, Transform> = {
	kebab: kebabCase,
	snake: snakeCase,
	camel: camelCase,
	pascal: (value: string) => upperFirst(camelCase(value)),
};

type Transform = (value: string) => string;

export default createRule({
	name: "match-exported",
	meta: {
		type: "problem",
		docs: {
			description: "Ensure that filenames match the exports of the file",
		},
		schema: [
			{
				type: "object",
				properties: {
					transforms: {
						type: "array",
						items: [{ type: "string" }],
					},
					removeRegex: { type: "string" },
					matchFunctionCalls: { type: "boolean" },
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
	defaultOptions: [
		{
			transforms: [] as string[],
			removeRegex: "",
			matchFunctionCalls: false,
		},
	],
	create(context) {
		const transforms = context.options[0].transforms;

		const replacePattern = context.options[0].removeRegex
			? new RegExp(context.options[0].removeRegex)
			: undefined;

		const matchFunctionCalls = !!context.options[0].matchFunctionCalls;

		return {
			Program(node) {
				const filename = context.filename;
				const absoluteFilename = path.resolve(filename);
				const parsed = parseFilename(absoluteFilename);
				const shouldIgnore = isIgnoredFilename(filename);
				const exportedName = getExportedName(node, matchFunctionCalls);
				const isExporting = !!exportedName;
				const expectedExport = getStringToCheckAgainstExport(
					parsed,
					replacePattern,
				);
				const transformedNames = transform(exportedName, transforms);
				const everythingIsIndex =
					exportedName === "index" && parsed.name === "index";
				const matchesExported =
					everythingIsIndex ||
					transformedNames.some((name) => name === expectedExport);

				if (shouldIgnore) return;

				if (!(isExporting && !matchesExported)) return;

				context.report({
					node,
					messageId: isIndexFile(parsed) ? "indexFile" : "normalFile",
					data: {
						name: parsed.base,
						expectedExport: expectedExport,
						exportName: transformedNames.join("', '"),
						extension: parsed.ext,
						whatToMatch: transforms.length
							? "any of the exported and transformed names"
							: "the exported name",
					},
				});
			},
		};
	},
});

function transform(name: string | undefined, transformNames: string[]) {
	if (!name) return [];

	const result = [name];

	for (const transformName of transformNames) {
		const transformer = TRANSFORMS[transformName];

		if (transformer) result.push(transformer(name));
	}

	return result;
}

function getStringToCheckAgainstExport(
	parsed: ParsedFilename,
	replacePattern?: RegExp | undefined,
) {
	const dirArray = parsed.dir.split(path.sep);
	const lastDirectory = dirArray[dirArray.length - 1];

	if (isIndexFile(parsed)) return lastDirectory;

	return replacePattern ? parsed.name.replace(replacePattern, "") : parsed.name;
}
