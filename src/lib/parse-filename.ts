import path from "node:path";

export default function parseFilename(filename: string) {
	const ext = path.extname(filename);
	const name = path.basename(filename, ext);

	return {
		ext,
		name,
		dir: path.dirname(filename),
		base: path.basename(filename),
		isIndex: name === "index",
	};
}

export type ParsedFilename = ReturnType<typeof parseFilename>;
