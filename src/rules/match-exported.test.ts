import { mock } from "node:test";

import { RuleTester } from "eslint";

import matchExported from "./match-exported.js";

import type { Rule } from "eslint";
import { withExtensions } from "./test-helpers.js";

const testCode = "var foo = 'bar';";
const testCallCode = "export default foo();";
const exportedVariableCode = "module.exports = exported;";
const exportedJsxClassCode =
	"module.exports = class Foo { render() { return <span>Test Class</span>; } };";
const exportedClassCode = "module.exports = class Foo {};";
const exportedFunctionCode = "module.exports = function foo() {};";
const exportUnnamedFunctionCode = "module.exports = function() {};";
const exportedCalledFunctionCode = "module.exports = foo();";
const exportedJsxFunctionCode =
	"module.exports = function foo() { return <span>Test Fn</span> };";
const exportedEs6VariableCode = "export default exported;";
const exportedEs6ClassCode = "export default class Foo {};";
const exportedEs6JsxClassCode =
	"export default class Foo { render() { return <span>Test Class</span>; } };";
const exportedEs6FunctionCode = "export default function foo() {};";
const exportedEs6JsxFunctionCode =
	"export default function foo() { return <span>Test Fn</span> };";
const exportedEs6Index = "export default function index() {};";
const camelCaseCommonJS = "module.exports = variableName;";
const snakeCaseCommonJS = "module.exports = variable_name;";
const camelCaseEs6 = "export default variableName;";
const snakeCaseEs6 = "export default variable_name;";
const ruleTester = new RuleTester();
const rule = matchExported as unknown as Rule.RuleModule;

mock.method(process, "cwd", () => "/foo");

ruleTester.run("match-exported", rule, {
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
			code: exportUnnamedFunctionCode,
			filename: "testFile.js",
		},
		{
			code: testCode,
			filename: "/some/dir/exported.js",
		},
		{
			code: testCallCode,
			filename: "/some/dir/foo.js",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: exportedVariableCode,
			filename: "/some/dir/exported.js",
		},
		{
			code: exportedClassCode,
			filename: "/some/dir/Foo.js",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: exportedJsxClassCode,
			filename: "/some/dir/Foo.js",
			languageOptions: {
				ecmaVersion: 6,
				parserOptions: { ecmaFeatures: { jsx: true } },
			},
		},
		{
			code: exportedFunctionCode,
			filename: "/some/dir/foo.js",
		},
		{
			code: exportedCalledFunctionCode,
			filename: "/some/dir/bar.js",
		},
		{
			code: exportedJsxFunctionCode,
			filename: "/some/dir/foo.js",
			languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
		},
		{
			code: exportedEs6VariableCode,
			filename: "/some/dir/exported.js",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: exportedEs6ClassCode,
			filename: "/some/dir/Foo.js",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: exportedEs6JsxClassCode,
			filename: "/some/dir/Foo.js",
			languageOptions: {
				ecmaVersion: 6,
				sourceType: "module",
				parserOptions: { ecmaFeatures: { jsx: true } },
			},
		},
		{
			code: exportedEs6FunctionCode,
			filename: "/some/dir/foo.js",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: exportedEs6JsxFunctionCode,
			filename: "/some/dir/foo.js",
			languageOptions: {
				ecmaVersion: 6,
				sourceType: "module",
				parserOptions: { ecmaFeatures: { jsx: true } },
			},
		},
		{
			code: exportedEs6FunctionCode,
			filename: "/some/dir/foo/index.js",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: exportedEs6JsxFunctionCode,
			filename: "/some/dir/foo/index.js",
			languageOptions: {
				ecmaVersion: 6,
				sourceType: "module",
				parserOptions: { ecmaFeatures: { jsx: true } },
			},
		},
		{
			code: exportedEs6FunctionCode,
			// /foo is used as cwd for test setup so full path will be /foo/index.js
			filename: "index.js",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: exportedEs6Index,
			// /foo is used as cwd for test setup so full path will be /foo/index.js
			filename: "index.js",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
	]),

	invalid: withExtensions([
		{
			code: exportedVariableCode,
			filename: "/some/dir/fooBar.js",
			errors: [
				{
					messageId: "noTransform",
					data: { exportingFileName: "fooBar", candidateFileNames: "exported" },
					column: 1,
					line: 1,
				},
			],
		},
		{
			code: exportedClassCode,
			filename: "/some/dir/foo.js",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "noTransform",
					data: { exportingFileName: "foo", candidateFileNames: "Foo" },
					column: 1,
					line: 1,
				},
			],
		},
		{
			code: exportedJsxClassCode,
			filename: "/some/dir/foo.js",
			languageOptions: {
				ecmaVersion: 6,
				parserOptions: { ecmaFeatures: { jsx: true } },
			},
			errors: [
				{
					messageId: "noTransform",
					data: { exportingFileName: "foo", candidateFileNames: "Foo" },
					column: 1,
					line: 1,
				},
			],
		},
		{
			code: exportedFunctionCode,
			filename: "/some/dir/bar.js",
			errors: [
				{
					messageId: "noTransform",
					data: { exportingFileName: "bar", candidateFileNames: "foo" },
					column: 1,
					line: 1,
				},
			],
		},
		{
			code: exportedJsxFunctionCode,
			filename: "/some/dir/bar.js",
			languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
			errors: [
				{
					messageId: "noTransform",
					data: { exportingFileName: "bar", candidateFileNames: "foo" },
					column: 1,
					line: 1,
				},
			],
		},
		{
			code: exportedEs6VariableCode,
			filename: "/some/dir/fooBar.js",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
			errors: [
				{
					messageId: "noTransform",
					data: { exportingFileName: "fooBar", candidateFileNames: "exported" },
					column: 1,
					line: 1,
				},
			],
		},
		{
			code: exportedEs6ClassCode,
			filename: "/some/dir/bar.js",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
			errors: [
				{
					messageId: "noTransform",
					data: { exportingFileName: "bar", candidateFileNames: "Foo" },
					column: 1,
					line: 1,
				},
			],
		},
		{
			code: exportedEs6JsxClassCode,
			filename: "/some/dir/bar.js",
			languageOptions: {
				ecmaVersion: 6,
				sourceType: "module",
				parserOptions: { ecmaFeatures: { jsx: true } },
			},
			errors: [
				{
					messageId: "noTransform",
					data: { exportingFileName: "bar", candidateFileNames: "Foo" },
					column: 1,
					line: 1,
				},
			],
		},
		{
			code: exportedEs6FunctionCode,
			filename: "/some/dir/fooBar/index.js",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
			errors: [
				{
					messageId: "indexFile",
					data: { exportingFileName: "fooBar", candidateFileNames: "foo" },
					column: 1,
					line: 1,
				},
			],
		},
		{
			code: exportedEs6JsxFunctionCode,
			filename: "/some/dir/fooBar/index.js",
			languageOptions: {
				ecmaVersion: 6,
				sourceType: "module",
				parserOptions: { ecmaFeatures: { jsx: true } },
			},
			errors: [
				{
					messageId: "indexFile",
					data: { exportingFileName: "fooBar", candidateFileNames: "foo" },
					column: 1,
					line: 1,
				},
			],
		},
		{
			code: exportedVariableCode,
			filename: "index.js",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
			errors: [
				{
					messageId: "indexFile",
					data: { exportingFileName: "foo", candidateFileNames: "exported" },
					column: 1,
					line: 1,
				},
			],
		},
		{
			code: exportedJsxClassCode,
			filename: "/some/dir/Foo.react.js",
			languageOptions: {
				ecmaVersion: 6,
				parserOptions: { ecmaFeatures: { jsx: true } },
			},
			errors: [
				{
					messageId: "noTransform",
					data: { exportingFileName: "Foo.react", candidateFileNames: "Foo" },
					column: 1,
					line: 1,
				},
			],
		},
	]),
});

ruleTester.run("lib/rules/match-exported with configuration", rule, {
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
			code: camelCaseCommonJS,
			filename: "variable_name.js",
			options: [{ transforms: ["snake"] }],
		},
		{
			code: camelCaseCommonJS,
			filename: "variable_name/index.js",
			options: [{ transforms: ["snake"] }],
		},
		{
			code: camelCaseCommonJS,
			filename: "variable-name.js",
			options: [{ transforms: ["kebab"] }],
		},
		{
			code: snakeCaseCommonJS,
			filename: "variableName.js",
			options: [{ transforms: ["camel"] }],
		},
		{
			code: camelCaseEs6,
			filename: "variable_name.js",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
			options: [{ transforms: ["snake"] }],
		},
		{
			code: camelCaseEs6,
			filename: "variable-name.js",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
			options: [{ transforms: ["kebab"] }],
		},
		{
			code: snakeCaseEs6,
			filename: "variableName.js",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
			options: [{ transforms: ["camel"] }],
		},
		{
			code: snakeCaseEs6,
			filename: "VariableName.js",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
			options: [{ transforms: ["pascal"] }],
		},
		{
			code: snakeCaseEs6,
			filename: "variableName.js",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
			options: [{ transforms: ["pascal", "camel"] }],
		},
		{
			code: snakeCaseEs6,
			filename: "VariableName.js",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
			options: [{ transforms: ["pascal", "camel"] }],
		},
		{
			code: exportedJsxClassCode,
			filename: "/some/dir/Foo.react.js",
			languageOptions: {
				ecmaVersion: 6,
				parserOptions: { ecmaFeatures: { jsx: true } },
			},
			options: [{ remove: "\\.react$" }],
		},
		{
			code: exportedEs6JsxClassCode,
			filename: "/some/dir/Foo.react.js",
			languageOptions: {
				ecmaVersion: 6,
				sourceType: "module",
				parserOptions: { ecmaFeatures: { jsx: true } },
			},
			options: [{ remove: "\\.react$" }],
		},
		{
			code: exportedCalledFunctionCode,
			filename: "/some/dir/foo.js",
			options: [{ matchExportedFunctionCalls: true }],
		},
	]),

	invalid: withExtensions([
		{
			code: camelCaseCommonJS,
			filename: "variableName.js",
			options: [{ transforms: ["snake"] }],
			errors: [
				{
					messageId: "singleTransform",
					data: {
						exportingFileName: "variableName",
						candidateFileNames: "variable_name",
					},
					column: 1,
					line: 1,
				},
			],
		},
		{
			code: camelCaseEs6,
			filename: "variableName.js",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
			options: [{ transforms: ["kebab"] }],
			errors: [
				{
					messageId: "singleTransform",
					data: {
						exportingFileName: "variableName",
						candidateFileNames: "variable-name",
					},
					column: 1,
					line: 1,
				},
			],
		},
		{
			code: camelCaseEs6,
			filename: "variableName.js",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
			options: [{ transforms: ["pascal"] }],
			errors: [
				{
					messageId: "singleTransform",
					data: {
						exportingFileName: "variableName",
						candidateFileNames: "VariableName",
					},
					column: 1,
					line: 1,
				},
			],
		},
		{
			code: camelCaseEs6,
			filename: "VariableName.js",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
			options: [{ transforms: [] }],
			errors: [
				{
					messageId: "noTransform",
					data: {
						exportingFileName: "VariableName",
						candidateFileNames: "variableName",
					},
					column: 1,
					line: 1,
				},
			],
		},
		{
			code: camelCaseEs6,
			filename: "variableName.js",
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
			options: [{ transforms: ["pascal", "snake"] }],
			errors: [
				{
					messageId: "multipleTransforms",
					data: {
						exportingFileName: "variableName",
						candidateFileNames: "VariableName', 'variable_name",
					},
					column: 1,
					line: 1,
				},
			],
		},
		{
			code: exportedEs6JsxClassCode,
			filename: "/some/dir/Foo.bar.js",
			languageOptions: {
				ecmaVersion: 6,
				sourceType: "module",
				parserOptions: { ecmaFeatures: { jsx: true } },
			},
			options: [{ remove: "\\.react$" }],
			errors: [
				{
					messageId: "noTransform",
					data: {
						exportingFileName: "Foo.bar",
						candidateFileNames: "Foo",
					},
					column: 1,
					line: 1,
				},
			],
		},
		{
			code: exportedEs6JsxClassCode,
			filename: "/some/dir/Foo.react/index.js",
			languageOptions: {
				ecmaVersion: 6,
				sourceType: "module",
				parserOptions: { ecmaFeatures: { jsx: true } },
			},
			options: [{ remove: "\\.react$" }],
			errors: [
				{
					messageId: "indexFile",
					data: {
						exportingFileName: "Foo.react",
						candidateFileNames: "Foo",
					},
					column: 1,
					line: 1,
				},
			],
		},
		{
			code: exportedCalledFunctionCode,
			filename: "/some/dir/bar.js",
			options: [{ matchExportedFunctionCall: true }],
			errors: [
				{
					messageId: "noTransform",
					data: {
						exportingFileName: "bar",
						candidateFileNames: "foo",
					},
					column: 1,
					line: 1,
				},
			],
		},
	]),
});
