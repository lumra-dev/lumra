import { afterAll, describe, expect, it } from "bun:test";
import { join } from "node:path";
import { createRuntimeX } from "../../index";
import { closeBrowserRuntime } from "./state";

process.env.PUPPETEER_CACHE_DIR ??= join(process.cwd(), ".tmp/puppeteer");

describe("browser runtime actions", () => {
	afterAll(async () => {
		await closeBrowserRuntime();
	});

	it("reads the example.com document", async () => {
		const x = await createRuntimeX({
			sessionId: "browser-example",
		});
		const url = "https://example.com";
		const launch = await x.exec(
			`browser launch --json '${JSON.stringify({ url })}'`
		);

		expect(launch.exitCode).toBe(0);
		expect(JSON.parse(launch.stdout)).toEqual({ pageId: "active" });

		const evaluate = await x.exec(
			`browser evaluate --json '{"code":"return await page.evaluate(() => ({ heading: document.querySelector(\\"h1\\")?.textContent, paragraph: document.querySelector(\\"p\\")?.textContent, link: document.querySelector(\\"a\\")?.href, linkText: document.querySelector(\\"a\\")?.textContent }))"}'`
		);

		expect(evaluate.exitCode).toBe(0);
		expect(JSON.parse(evaluate.stdout)).toEqual({
			pageId: "active",
			result: {
				heading: "Example Domain",
				link: "https://iana.org/domains/example",
				linkText: "Learn more",
				paragraph:
					"This domain is for use in documentation examples without needing permission. Avoid use in operations.",
			},
		});
	});
});
