import { defineRuntimeAction } from "../../../executor";
import { activePageId, resolveBrowserPage } from "../state";

export interface BrowserScreenshotInput {
	fullPage?: boolean;
	pageId?: string;
	path?: string;
}

export interface BrowserScreenshotOutput {
	base64?: string;
	pageId: string;
	path?: string;
}

export const browserScreenshotAction = defineRuntimeAction<
	BrowserScreenshotInput,
	BrowserScreenshotOutput
>({
	path: "browser.screenshot",
	description: "Capture a screenshot from the active local Puppeteer page.",
	async execute(input) {
		const page = resolveBrowserPage(input.pageId);
		const screenshot = await page.screenshot({
			encoding: "base64",
			fullPage: input.fullPage,
			path: input.path,
		});

		return {
			base64: input.path ? undefined : screenshot,
			pageId: input.pageId ?? activePageId,
			path: input.path,
		};
	},
});
