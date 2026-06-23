import type { Browser, Page } from "puppeteer";

export const activePageId = "active";

let activeBrowser: Browser | undefined;
let activePage: Page | undefined;

export function setActiveBrowser(browser: Browser, page: Page): void {
	activeBrowser = browser;
	activePage = page;
}

export function resolveBrowser(): Browser {
	if (!activeBrowser) {
		throw new Error("No active Puppeteer browser. Run browser.launch first.");
	}

	return activeBrowser;
}

export function resolveBrowserPage(pageId = activePageId): Page {
	if (pageId !== activePageId) {
		throw new Error(`Unknown Puppeteer page id: ${pageId}`);
	}

	if (!activePage) {
		throw new Error("No active Puppeteer page. Run browser.launch first.");
	}

	return activePage;
}

export async function closeBrowserRuntime(): Promise<void> {
	const browser = activeBrowser;

	activeBrowser = undefined;
	activePage = undefined;

	await browser?.close();
}
