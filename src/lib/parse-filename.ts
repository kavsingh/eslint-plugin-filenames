import path from "node:path";

export default function parseFilename(filename: string) {
	const absolutePath = path.resolve(filename);
	const ext = path.extname(absolutePath);
	const name = path.basename(absolutePath, ext);

	return {
		ext,
		name,
		dir: path.dirname(absolutePath),
		base: path.basename(absolutePath),
		isIndex: name === "index",
	};
}

export type ParsedFilename = ReturnType<typeof parseFilename>;
