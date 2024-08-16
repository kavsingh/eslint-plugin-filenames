import type {
	Program,
	Expression,
	MaybeNamedClassDeclaration,
	MaybeNamedFunctionDeclaration,
	// eslint-disable-next-line n/no-missing-import
} from "estree";

export default function getExportedName(
	programNode: Program,
	useCallExpression?: boolean | undefined,
) {
	for (const node of programNode.body) {
		// export default ...
		if (node.type === "ExportDefaultDeclaration") {
			return getNodeName(node.declaration, useCallExpression);
		}

		// module.exports = ...
		if (
			node.type === "ExpressionStatement" &&
			node.expression.type === "AssignmentExpression" &&
			node.expression.left.type === "MemberExpression" &&
			node.expression.left.object.type === "Identifier" &&
			node.expression.left.object.name === "module" &&
			node.expression.left.property.type === "Identifier" &&
			node.expression.left.property.name === "exports"
		) {
			return getNodeName(node.expression.right, useCallExpression);
		}
	}

	return undefined;
}

function getNodeName(
	node: MaybeNamedFunctionDeclaration | MaybeNamedClassDeclaration | Expression,
	useCallExpression?: boolean | undefined,
) {
	if (node.type === "Identifier") {
		return node.name;
	}

	if ("id" in node && node.id) {
		return node.id.name;
	}

	if (
		useCallExpression &&
		node.type === "CallExpression" &&
		node.callee.type === "Identifier"
	) {
		return node.callee.name;
	}

	return undefined;
}
