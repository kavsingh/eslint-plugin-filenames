import { AST_NODE_TYPES } from "@typescript-eslint/utils";

import type { TSESTree } from "@typescript-eslint/utils";

function getNodeName(
	node: TSESTree.DefaultExportDeclarations,
	useCallExpression?: boolean | undefined,
) {
	if (node.type === AST_NODE_TYPES.Identifier) {
		return node.name;
	}

	if ("id" in node && node.id && node.id.type === AST_NODE_TYPES.Identifier) {
		return node.id.name;
	}

	if (
		useCallExpression &&
		node.type === AST_NODE_TYPES.CallExpression &&
		node.callee.type === AST_NODE_TYPES.Identifier
	) {
		return node.callee.name;
	}

	return undefined;
}

export default function getExportedName(
	programNode: TSESTree.Program,
	useCallExpression?: boolean | undefined,
) {
	for (const node of programNode.body) {
		// export default ...
		if (node.type === AST_NODE_TYPES.ExportDefaultDeclaration) {
			return getNodeName(node.declaration, useCallExpression);
		}

		// module.exports = ...
		if (
			node.type === AST_NODE_TYPES.ExpressionStatement &&
			node.expression.type === AST_NODE_TYPES.AssignmentExpression &&
			node.expression.left.type === AST_NODE_TYPES.MemberExpression &&
			node.expression.left.object.type === AST_NODE_TYPES.Identifier &&
			node.expression.left.object.name === "module" &&
			node.expression.left.property.type === AST_NODE_TYPES.Identifier &&
			node.expression.left.property.name === "exports"
		) {
			return getNodeName(node.expression.right, useCallExpression);
		}
	}

	return undefined;
}
