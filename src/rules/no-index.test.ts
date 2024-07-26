import { RuleTester } from "eslint";

import noIndex from "./no-index.js";

import type { Rule } from "eslint";

const testCode = "var foo = 'bar';";
const ruleTester = new RuleTester();
const rule = noIndex as unknown as Rule.RuleModule;

ruleTester.run("lib/rules/no-index", rule, {
	valid: [
		{
			code: testCode,
			filename: "<text>",
		},
		{
			code: testCode,
			filename: "<input>",
		},
		{
			code: testCode,
			filename: "foo.js",
		},
		{
			code: testCode,
			filename: "/some/dir/foo.js",
		},
	],

	invalid: [
		{
			code: testCode,
			filename: "index.js",
			errors: [
				{ message: "'index.js' files are not allowed.", column: 1, line: 1 },
			],
		},
		{
			code: testCode,
			filename: "/some/dir/index.js",
			errors: [
				{ message: "'index.js' files are not allowed.", column: 1, line: 1 },
			],
		},
	],
});
