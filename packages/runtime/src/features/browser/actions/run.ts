import puppeteer from "puppeteer";
import { defineRuntimeAction } from "../../../executor";

export interface BrowserRunInput {
	code: string;
}

export interface BrowserRunOutput {
	result: unknown;
}

export const browserRunAction = defineRuntimeAction<
	BrowserRunInput,
	BrowserRunOutput
>({
	path: "browser.run",
	description: "Run JavaScript with Puppeteer in the browser runtime.",
	async execute(input) {
		// The model-provided code owns the Puppeteer browser lifecycle.
		const result = await new Function(
			"browser",
			"puppeteer",
			`return (async () => {
				${input.code}
			})()`
		)(puppeteer, puppeteer);

		return {
			result,
		};
	},
});
