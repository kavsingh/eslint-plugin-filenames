/* node:coverage disable */

import { RuleTester } from "eslint";

import noIndex from "./no-index.js";

import type { Rule } from "eslint";
import { withExtensions } from "./test-helpers.js";

const testCode = "var foo = 'bar';";
const ruleTester = new RuleTester();
const rule = noIndex as unknown as Rule.RuleModule;

ruleTester.run("lib/rules/no-index", rule, {
	valid: withExtensions([
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
	]),

	invalid: withExtensions([
		{
			code: testCode,
			filename: "index.js",
			errors: [{ messageId: "notAllowed", column: 1, line: 1 }],
		},
		{
			code: testCode,
			filename: "/some/dir/index.js",
			errors: [{ messageId: "notAllowed", column: 1, line: 1 }],
		},
	]),
});
