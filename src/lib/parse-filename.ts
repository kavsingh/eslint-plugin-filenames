import path from "node:path";

export default function parseFilename(filename: string): ParsedFilename {
	const parsed = path.parse(path.resolve(filename));

	return {
		...parsed,
		isIndex: parsed.name === "index",
		// https://eslint.org/docs/latest/extend/custom-rules#the-context-object
		shouldIgnore: filename === "<text>" || filename === "<input>",
	};
}

export type ParsedFilename = Readonly<
	path.ParsedPath & { isIndex: boolean; shouldIgnore: boolean }
>;
