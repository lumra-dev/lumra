import { defineRuntimeAction } from "../../../executor";
import { closeBrowserRuntime } from "../state";

export type BrowserCloseInput = Record<string, never>;

export interface BrowserCloseOutput {
	closed: true;
}

export const browserCloseAction = defineRuntimeAction<
	BrowserCloseInput,
	BrowserCloseOutput
>({
	path: "browser.close",
	description: "Close the active local Puppeteer browser.",
	async execute() {
		await closeBrowserRuntime();

		return {
			closed: true,
		};
	},
});
