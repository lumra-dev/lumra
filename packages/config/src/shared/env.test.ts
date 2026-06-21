/** biome-ignore-all lint/suspicious/noTemplateCurlyInString: env */
import { afterEach, describe, expect, it } from "bun:test";

import { env } from "./env";

const ENV_KEYS = ["LUMRA_TEST_TOKEN", "LUMRA_TEST_SECOND_TOKEN"] as const;

const envToken = (name: string): string => `\${${name}}`;

const restoreEnv = (): void => {
	for (const key of ENV_KEYS) {
		delete process.env[key];
	}
};

afterEach(() => {
	restoreEnv();
});

describe("envSchema", () => {
	it("replaces env template tokens with process.env values", () => {
		process.env.LUMRA_TEST_TOKEN = "secret-token";

		const value = env().parse(
			`https://example.com/api/${envToken("LUMRA_TEST_TOKEN")}`
		);

		expect(value).toBe("https://example.com/api/secret-token");
	});

	it("replaces multiple env template tokens in one string", () => {
		process.env.LUMRA_TEST_TOKEN = "first";
		process.env.LUMRA_TEST_SECOND_TOKEN = "second";

		const value = env().parse(
			`${envToken("LUMRA_TEST_TOKEN")}:${envToken("LUMRA_TEST_SECOND_TOKEN")}`
		);

		expect(value).toBe("first:second");
	});

	it("keeps unresolved env template tokens unchanged", () => {
		const unresolvedToken = envToken("LUMRA_TEST_TOKEN");
		const value = env().parse(`Bearer ${unresolvedToken}`);

		expect(value).toBe(`Bearer ${unresolvedToken}`);
	});

	it("ignores unsupported template token names", () => {
		process.env.LUMRA_TEST_TOKEN = "secret-token";

		const unsupportedToken = envToken("lumra_test_token");
		const value = env().parse(
			`${unsupportedToken}:${envToken("LUMRA_TEST_TOKEN")}`
		);

		expect(value).toBe(`${unsupportedToken}:secret-token`);
	});
});
