// src/rules/match-exported.ts
import path2 from "node:path";
import { ESLintUtils } from "@typescript-eslint/utils";
import camelCase from "lodash.camelcase";
import kebabCase from "lodash.kebabcase";
import snakeCase from "lodash.snakecase";
import upperFirst from "lodash.upperfirst";

// src/lib/get-exported-name.ts
import { AST_NODE_TYPES } from "@typescript-eslint/utils";
function getNodeName(node, useCallExpression) {
  if (node.type === AST_NODE_TYPES.Identifier) {
    return node.name;
  }
  if ("id" in node && node.id && node.id.type === AST_NODE_TYPES.Identifier) {
    return node.id.name;
  }
  if (useCallExpression && node.type === AST_NODE_TYPES.CallExpression && node.callee.type === AST_NODE_TYPES.Identifier) {
    return node.callee.name;
  }
  return void 0;
}
function getExportedName(programNode, useCallExpression) {
  for (const node of programNode.body) {
    if (node.type === AST_NODE_TYPES.ExportDefaultDeclaration) {
      return getNodeName(node.declaration, useCallExpression);
    }
    if (node.type === AST_NODE_TYPES.ExpressionStatement && node.expression.type === AST_NODE_TYPES.AssignmentExpression && node.expression.left.type === AST_NODE_TYPES.MemberExpression && node.expression.left.object.type === AST_NODE_TYPES.Identifier && node.expression.left.object.name === "module" && node.expression.left.property.type === AST_NODE_TYPES.Identifier && node.expression.left.property.name === "exports") {
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
import path from "node:path";
function parseFilename(filename) {
  const ext = path.extname(filename);
  return {
    ext,
    dir: path.dirname(filename),
    base: path.basename(filename),
    name: path.basename(filename, ext)
  };
}

// src/rules/match-exported.ts
var createRule = ESLintUtils.RuleCreator((name) => {
  return `https://github.com/kavsingh/eslint-plugin-filenames?tab=readme-ov-file#${name}`;
});
var TRANSFORMS = {
  kebab: kebabCase,
  snake: snakeCase,
  camel: camelCase,
  pascal: (value) => upperFirst(camelCase(value))
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
        const absoluteFilename = path2.resolve(filename);
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
  const dirArray = parsed.dir.split(path2.sep);
  const lastDirectory = dirArray[dirArray.length - 1];
  if (isIndexFile(parsed)) return lastDirectory;
  return replacePattern ? parsed.name.replace(replacePattern, "") : parsed.name;
}

// src/rules/match-regex.ts
import { ESLintUtils as ESLintUtils2 } from "@typescript-eslint/utils";
var createRule2 = ESLintUtils2.RuleCreator((name) => {
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
import path3 from "node:path";
import { ESLintUtils as ESLintUtils3 } from "@typescript-eslint/utils";
var createRule3 = ESLintUtils3.RuleCreator((name) => {
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
        const absoluteFilename = path3.resolve(filename);
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
export {
  src_default as default
};
