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
			filename: "foo.js",
		},
		{
			code: testCode,
			filename: "/some/dir/foo.js",
		},
		{
			code: testCode,
			filename: "foo.ts",
		},
		{
			code: testCode,
			filename: "/some/dir/foo.ts",
		},
		{
			code: testCode,
			filename: "foo.jsx",
		},
		{
			code: testCode,
			filename: "/some/dir/foo.jsx",
		},
		{
			code: testCode,
			filename: "foo.tsx",
		},
		{
			code: testCode,
			filename: "/some/dir/foo.tsx",
		},
	],

	invalid: [
		{
			code: testCode,
			filename: "index.js",
			errors: [{ message: "index files are not allowed.", column: 1, line: 1 }],
		},
		{
			code: testCode,
			filename: "index.ts",
			errors: [{ message: "index files are not allowed.", column: 1, line: 1 }],
		},
		{
			code: testCode,
			filename: "index.jsx",
			errors: [{ message: "index files are not allowed.", column: 1, line: 1 }],
		},
		{
			code: testCode,
			filename: "index.tsx",
			errors: [{ message: "index files are not allowed.", column: 1, line: 1 }],
		},
		{
			code: testCode,
			filename: "/some/dir/index.js",
			errors: [{ message: "index files are not allowed.", column: 1, line: 1 }],
		},
		{
			code: testCode,
			filename: "/some/dir/index.ts",
			errors: [{ message: "index files are not allowed.", column: 1, line: 1 }],
		},
		{
			code: testCode,
			filename: "/some/dir/index.jsx",
			errors: [{ message: "index files are not allowed.", column: 1, line: 1 }],
		},
		{
			code: testCode,
			filename: "/some/dir/index.tsx",
			errors: [{ message: "index files are not allowed.", column: 1, line: 1 }],
		},
	],
});
