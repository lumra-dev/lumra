import { defineRuntimeAction } from "../../../executor";
import { activePageId, resolveBrowser, resolveBrowserPage } from "../state";

export interface BrowserEvaluateInput {
	args?: unknown;
	code: string;
	pageId?: string;
}

export interface BrowserEvaluateOutput {
	pageId: string;
	result: unknown;
}

export const browserEvaluateAction = defineRuntimeAction<
	BrowserEvaluateInput,
	BrowserEvaluateOutput
>({
	path: "browser.evaluate",
	description: "Evaluate JavaScript on the active local Puppeteer page.",
	async execute(input) {
		const browser = resolveBrowser();
		const page = resolveBrowserPage(input.pageId);
		// Expose Puppeteer objects to the runtime-side JIT entrypoint.
		const result = await new Function(
			"browser",
			"page",
			"args",
			`return (async () => {
				${input.code}
			})()`
		)(browser, page, input.args);

		return {
			pageId: input.pageId ?? activePageId,
			result,
		};
	},
});
