/* node:coverage disable */

import type { RuleTester } from "eslint";

const defaultExtensions = [
	"js",
	"cjs",
	"mjs",
	"jsx",
	"ts",
	"cts",
	"mts",
	"tsx",
];

export function withExtensions<
	TCase extends RuleTester.ValidTestCase | RuleTester.InvalidTestCase,
>(testCases: TCase[], extensions = defaultExtensions) {
	return testCases.flatMap((testCase) => {
		const baseFilename = testCase.filename
			? testCase.filename.replace(/\.(js|cjs|mjs|jsx|ts|cts|mts|tsx)$/, "")
			: undefined;

		if (!baseFilename) {
			return testCase;
		}

		if (baseFilename === "<text>" || baseFilename === "<input>") {
			return testCase;
		}

		return extensions.map((extension) => {
			return { ...testCase, filename: `${baseFilename}.${extension}` };
		});
	});
}
