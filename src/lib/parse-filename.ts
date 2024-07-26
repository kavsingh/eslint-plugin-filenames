import path from "node:path";

export default function parseFilename(filename: string) {
	const ext = path.extname(filename);

	return {
		ext,
		dir: path.dirname(filename),
		base: path.basename(filename),
		name: path.basename(filename, ext),
	};
}

export type ParsedFilename = ReturnType<typeof parseFilename>;
