import { RuleTester } from "eslint";

import matchRegex from "./match-regex.js";

import type { Rule } from "eslint";

const exportingCode = "module.exports = foo";
const exportedFunctionCall = "module.exports = foo()";
const testCode = "var foo = 'bar';";
const ruleTester = new RuleTester();
const rule = matchRegex as unknown as Rule.RuleModule;

ruleTester.run("lib/rules/match-regex", rule, {
	valid: [
		{
			code: testCode,
			filename: "foobar.js",
		},
		{
			code: testCode,
			filename: "fooBar.js",
		},
		{
			code: testCode,
			filename: "foo1Bar1.js",
		},
		{
			code: testCode,
			filename: "foo_bar.js",
			options: ["^[a-z_]+$"],
		},
		{
			code: testCode,
			filename: "/foo/dir/foo_bar.js",
			options: ["^[a-z_]+$"],
		},
		{
			code: testCode,
			filename: "/foo/dir/fooBar.js",
		},
		{
			code: exportingCode,
			filename: "foo_bar.js",
			options: ["", { ignoreDefaultExport: true }],
		},
		{
			code: exportingCode,
			filename: "fooBar.js",
			options: ["^[a-z_]$", { ignoreDefaultExport: true }],
		},
		{
			code: exportedFunctionCall,
			filename: "foo_bar.js",
			options: ["^[a-z_]+$", { ignoreDefaultExport: true }],
		},
	],

	invalid: [
		{
			code: testCode,
			filename: "/some/dir/foo_bar.js",
			errors: [
				{
					message:
						"Filename 'foo_bar.js' does not match the naming convention.",
					column: 1,
					line: 1,
				},
			],
		},
		{
			code: testCode,
			filename: "/some/dir/fooBAR.js",
			errors: [
				{
					message: "Filename 'fooBAR.js' does not match the naming convention.",
					column: 1,
					line: 1,
				},
			],
		},
		{
			code: testCode,
			filename: "fooBar$.js",
			errors: [
				{
					message:
						"Filename 'fooBar$.js' does not match the naming convention.",
					column: 1,
					line: 1,
				},
			],
		},
		{
			code: testCode,
			filename: "fooBar.js",
			options: ["^[a-z_]$"],
			errors: [
				{
					message: "Filename 'fooBar.js' does not match the naming convention.",
					column: 1,
					line: 1,
				},
			],
		},
	],
});
