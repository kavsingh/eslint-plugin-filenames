import { RuleTester } from "eslint";

import matchRegex from "./match-regex.js";

import type { Rule } from "eslint";
import { withExtensions } from "./test-helpers.js";

const exportingCode = "module.exports = foo";
const exportedFunctionCall = "module.exports = foo()";
const testCode = "var foo = 'bar';";
const ruleTester = new RuleTester();
const rule = matchRegex as unknown as Rule.RuleModule;

ruleTester.run("lib/rules/match-regex", rule, {
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
	]),

	invalid: withExtensions([
		{
			code: testCode,
			filename: "/some/dir/foo_bar.js",
			errors: [
				{
					messageId: "doesNotMatch",
					data: { name: "foo_bar" },
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
					messageId: "doesNotMatch",
					data: { name: "fooBAR" },
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
					messageId: "doesNotMatch",
					data: { name: "fooBar$" },
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
					messageId: "doesNotMatch",
					data: { name: "fooBar" },
					column: 1,
					line: 1,
				},
			],
		},
	]),
});
