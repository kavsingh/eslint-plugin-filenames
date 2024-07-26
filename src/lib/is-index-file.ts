import type { ParsedFilename } from "./parse-filename.js";

export default function isIndexFile(parsed: ParsedFilename) {
	return parsed.name === "index";
}
