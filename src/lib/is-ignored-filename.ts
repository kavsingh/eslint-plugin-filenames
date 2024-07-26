const ignoredFilenames = ["<text>", "<input>"];

export default function isIgnoredFilename(filename: string) {
	return ignoredFilenames.includes(filename);
}
