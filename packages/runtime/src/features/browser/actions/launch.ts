import puppeteer from "puppeteer";
import { defineRuntimeAction } from "../../../executor";
import { activePageId, closeBrowserRuntime, setActiveBrowser } from "../state";

export interface BrowserLaunchInput {
	headless?: boolean;
	url?: string;
}

export interface BrowserLaunchOutput {
	pageId: string;
}

export const browserLaunchAction = defineRuntimeAction<
	BrowserLaunchInput,
	BrowserLaunchOutput
>({
	path: "browser.launch",
	description: "Launch a local Puppeteer browser and create the active page.",
	async execute(input) {
		await closeBrowserRuntime();
		const browser = await puppeteer.launch({
			headless: input.headless ?? true,
		});
		const page = await browser.newPage();

		if (input.url) {
			await page.goto(input.url);
		}

		setActiveBrowser(browser, page);

		return {
			pageId: activePageId,
		};
	},
});
