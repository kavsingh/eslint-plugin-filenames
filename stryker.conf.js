export default {
	mutate: [
		"src/**/*.ts",
		"!src/**/*@(.test|.spec|.mock).ts",
		"!src/**/test-helpers.ts",
		"!src/index.ts",
	],
	testRunner: "command",
	commandRunner: { command: "pnpm t" },
	reporters: ["progress", "clear-text", "html"],
	coverageAnalysis: "all",
};
