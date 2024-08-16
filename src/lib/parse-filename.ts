import path from "node:path";

export default function parseFilename(filename: string): ParsedFilename {
	const parsed = path.parse(path.resolve(filename));

	return { ...parsed, isIndex: parsed.name === "index" };
}

export type ParsedFilename = Readonly<path.ParsedPath & { isIndex: boolean }>;
