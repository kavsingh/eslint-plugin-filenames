import test from "node:test";
import assert from "node:assert/strict";

import matchExported from "./rules/match-exported.js";
import matchRegex from "./rules/match-regex.js";
import noIndex from "./rules/no-index.js";
import plugin from "./index.js";

void test.describe("index.js", () => {
	void test.it("should export the match-regex rule", () => {
		assert.strictEqual(plugin.rules["match-regex"], matchRegex);
	});

	void test.it("should export the match-exported rule", () => {
		assert.strictEqual(plugin.rules["match-exported"], matchExported);
	});

	void test.it("should export the no-index rule", () => {
		assert.strictEqual(plugin.rules["no-index"], noIndex);
	});
});
