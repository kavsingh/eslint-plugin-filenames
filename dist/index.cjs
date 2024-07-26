"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }// src/rules/match-exported.ts
var _path = require('path'); var _path2 = _interopRequireDefault(_path);
var _utils = require('@typescript-eslint/utils');
var _lodashcamelcase = require('lodash.camelcase'); var _lodashcamelcase2 = _interopRequireDefault(_lodashcamelcase);
var _lodashkebabcase = require('lodash.kebabcase'); var _lodashkebabcase2 = _interopRequireDefault(_lodashkebabcase);
var _lodashsnakecase = require('lodash.snakecase'); var _lodashsnakecase2 = _interopRequireDefault(_lodashsnakecase);
var _lodashupperfirst = require('lodash.upperfirst'); var _lodashupperfirst2 = _interopRequireDefault(_lodashupperfirst);

// src/lib/get-exported-name.ts

function getNodeName(node, useCallExpression) {
  if (node.type === _utils.AST_NODE_TYPES.Identifier) {
    return node.name;
  }
  if ("id" in node && node.id && node.id.type === _utils.AST_NODE_TYPES.Identifier) {
    return node.id.name;
  }
  if (useCallExpression && node.type === _utils.AST_NODE_TYPES.CallExpression && node.callee.type === _utils.AST_NODE_TYPES.Identifier) {
    return node.callee.name;
  }
  return void 0;
}
function getExportedName(programNode, useCallExpression) {
  for (const node of programNode.body) {
    if (node.type === _utils.AST_NODE_TYPES.ExportDefaultDeclaration) {
      return getNodeName(node.declaration, useCallExpression);
    }
    if (node.type === _utils.AST_NODE_TYPES.ExpressionStatement && node.expression.type === _utils.AST_NODE_TYPES.AssignmentExpression && node.expression.left.type === _utils.AST_NODE_TYPES.MemberExpression && node.expression.left.object.type === _utils.AST_NODE_TYPES.Identifier && node.expression.left.object.name === "module" && node.expression.left.property.type === _utils.AST_NODE_TYPES.Identifier && node.expression.left.property.name === "exports") {
      return getNodeName(node.expression.right, useCallExpression);
    }
  }
  return void 0;
}

// src/lib/is-ignored-filename.ts
var ignoredFilenames = ["<text>", "<input>"];
function isIgnoredFilename(filename) {
  return ignoredFilenames.includes(filename);
}

// src/lib/is-index-file.ts
function isIndexFile(parsed) {
  return parsed.name === "index";
}

// src/lib/parse-filename.ts

function parseFilename(filename) {
  const ext = _path2.default.extname(filename);
  return {
    ext,
    dir: _path2.default.dirname(filename),
    base: _path2.default.basename(filename),
    name: _path2.default.basename(filename, ext)
  };
}

// src/rules/match-exported.ts
var createRule = _utils.ESLintUtils.RuleCreator((name) => {
  return `https://github.com/kavsingh/eslint-plugin-filenames?tab=readme-ov-file#${name}`;
});
var TRANSFORMS = {
  kebab: _lodashkebabcase2.default,
  snake: _lodashsnakecase2.default,
  camel: _lodashcamelcase2.default,
  pascal: (value) => _lodashupperfirst2.default.call(void 0, _lodashcamelcase2.default.call(void 0, value))
};
var match_exported_default = createRule({
  name: "match-exported",
  meta: {
    type: "problem",
    docs: {
      description: "Ensure that filenames match the exports of the file"
    },
    schema: [
      {
        type: "object",
        properties: {
          transforms: {
            type: "array",
            items: [{ type: "string" }]
          },
          removeRegex: { type: "string" },
          matchFunctionCalls: { type: "boolean" }
        }
      }
    ],
    messages: {
      normalFile: "Filename '{{expectedExport}}' must match {{whatToMatch}} '{{exportName}}'.",
      indexFile: "The directory '{{expectedExport}}' must be named '{{exportName}}', after the exported value of its index file."
    }
  },
  defaultOptions: [
    {
      transforms: [],
      removeRegex: "",
      matchFunctionCalls: false
    }
  ],
  create(context) {
    const transforms = context.options[0].transforms;
    const replacePattern = context.options[0].removeRegex ? new RegExp(context.options[0].removeRegex) : void 0;
    const matchFunctionCalls = !!context.options[0].matchFunctionCalls;
    return {
      Program(node) {
        const filename = context.filename;
        const absoluteFilename = _path2.default.resolve(filename);
        const parsed = parseFilename(absoluteFilename);
        const shouldIgnore = isIgnoredFilename(filename);
        const exportedName = getExportedName(node, matchFunctionCalls);
        const isExporting = !!exportedName;
        const expectedExport = getStringToCheckAgainstExport(
          parsed,
          replacePattern
        );
        const transformedNames = transform(exportedName, transforms);
        const everythingIsIndex = exportedName === "index" && parsed.name === "index";
        const matchesExported = everythingIsIndex || transformedNames.some((name) => name === expectedExport);
        if (shouldIgnore) return;
        if (!(isExporting && !matchesExported)) return;
        context.report({
          node,
          messageId: isIndexFile(parsed) ? "indexFile" : "normalFile",
          data: {
            name: parsed.base,
            expectedExport,
            exportName: transformedNames.join("', '"),
            extension: parsed.ext,
            whatToMatch: transforms.length ? "any of the exported and transformed names" : "the exported name"
          }
        });
      }
    };
  }
});
function transform(name, transforms) {
  const result = [];
  if (!name) return result;
  for (const transformName of transforms) {
    const transformer = TRANSFORMS[transformName];
    if (transformer) result.push(transformer(name));
  }
  return result;
}
function getStringToCheckAgainstExport(parsed, replacePattern) {
  const dirArray = parsed.dir.split(_path2.default.sep);
  const lastDirectory = dirArray[dirArray.length - 1];
  if (isIndexFile(parsed)) return lastDirectory;
  return replacePattern ? parsed.name.replace(replacePattern, "") : parsed.name;
}

// src/rules/match-regex.ts

var createRule2 = _utils.ESLintUtils.RuleCreator((name) => {
  return `https://github.com/kavsingh/eslint-plugin-filenames?tab=readme-ov-file#${name}`;
});
var match_regex_default = createRule2({
  name: "match-regex",
  meta: {
    type: "problem",
    docs: {
      description: "Enforce a file naming convention via regex (default: camelCase)"
    },
    schema: [
      {
        type: "string"
      },
      {
        type: "object",
        properties: {
          ignoreExported: { type: "boolean" }
        }
      }
    ],
    messages: {
      doesNotMatch: "Filename '{{name}}' does not match the naming convention."
    }
  },
  defaultOptions: [
    String(/^([a-z0-9]+)([A-Z][a-z0-9]+)*$/g),
    { ignoreExported: false }
  ],
  create(context) {
    const regexp = new RegExp(context.options[0]);
    const ignoreExported = !!context.options[1].ignoreExported;
    return {
      Program(node) {
        const filename = context.filename;
        if (isIgnoredFilename(filename)) return;
        const isExporting = !!getExportedName(node);
        if (ignoreExported && isExporting) return;
        const parsed = parseFilename(filename);
        if (regexp.test(parsed.name)) return;
        context.report({
          node,
          messageId: "doesNotMatch",
          data: { name: parsed.base }
        });
      }
    };
  }
});

// src/rules/no-index.ts


var createRule3 = _utils.ESLintUtils.RuleCreator((name) => {
  return `https://github.com/kavsingh/eslint-plugin-filenames?tab=readme-ov-file#${name}`;
});
var no_index_default = createRule3({
  name: "no-index",
  meta: {
    type: "problem",
    docs: {
      description: "Ensure no index files are used"
    },
    schema: [],
    messages: {
      notAllowed: "'index.js' files are not allowed."
    }
  },
  defaultOptions: [],
  create(context) {
    return {
      Program(node) {
        const filename = context.filename;
        const absoluteFilename = _path2.default.resolve(filename);
        const parsed = parseFilename(absoluteFilename);
        const shouldIgnore = isIgnoredFilename(filename);
        const isIndex = isIndexFile(parsed);
        if (shouldIgnore || !isIndex) return;
        context.report({ node, messageId: "notAllowed" });
      }
    };
  }
});

// src/index.ts
var src_default = {
  meta: {
    name: "@kavsingh/eslint-plugin-filenames",
    version: "3.0.0"
  },
  // TODO: see if @typescript-eslint/utils resolves type issues
  rules: {
    "match-exported": match_exported_default,
    "match-regex": match_regex_default,
    "no-index": no_index_default
  }
};


exports.default = src_default;
