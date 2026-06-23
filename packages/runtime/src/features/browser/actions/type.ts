import { defineRuntimeAction } from "../../../executor";
import { activePageId, resolveBrowserPage } from "../state";

export interface BrowserTypeInput {
	pageId?: string;
	selector: string;
	text: string;
}

export interface BrowserTypeOutput {
	pageId: string;
	selector: string;
	typed: true;
}

export const browserTypeAction = defineRuntimeAction<
	BrowserTypeInput,
	BrowserTypeOutput
>({
	path: "browser.type",
	description: "Type text into an element on the active local Puppeteer page.",
	async execute(input) {
		const page = resolveBrowserPage(input.pageId);

		await page.type(input.selector, input.text);

		return {
			pageId: input.pageId ?? activePageId,
			selector: input.selector,
			typed: true,
		};
	},
});
