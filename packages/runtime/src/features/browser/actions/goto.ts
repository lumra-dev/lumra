import { defineRuntimeAction } from "../../../executor";
import { activePageId, resolveBrowserPage } from "../state";

export interface BrowserGotoInput {
	pageId?: string;
	url: string;
	waitUntil?: "domcontentloaded" | "load" | "networkidle0" | "networkidle2";
}

export interface BrowserGotoOutput {
	pageId: string;
	url: string;
}

export const browserGotoAction = defineRuntimeAction<
	BrowserGotoInput,
	BrowserGotoOutput
>({
	path: "browser.goto",
	description: "Navigate the active local Puppeteer page to a URL.",
	async execute(input) {
		const page = resolveBrowserPage(input.pageId);

		await page.goto(input.url, {
			waitUntil: input.waitUntil,
		});

		return {
			pageId: input.pageId ?? activePageId,
			url: page.url(),
		};
	},
});
