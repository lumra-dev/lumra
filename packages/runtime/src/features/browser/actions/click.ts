import { defineRuntimeAction } from "../../../executor";
import { activePageId, resolveBrowserPage } from "../state";

export interface BrowserClickInput {
	pageId?: string;
	selector: string;
}

export interface BrowserClickOutput {
	clicked: true;
	pageId: string;
	selector: string;
}

export const browserClickAction = defineRuntimeAction<
	BrowserClickInput,
	BrowserClickOutput
>({
	path: "browser.click",
	description: "Click an element on the active local Puppeteer page.",
	async execute(input) {
		const page = resolveBrowserPage(input.pageId);

		await page.click(input.selector);

		return {
			clicked: true,
			pageId: input.pageId ?? activePageId,
			selector: input.selector,
		};
	},
});
