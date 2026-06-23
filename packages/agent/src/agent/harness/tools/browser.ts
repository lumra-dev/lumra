import type {
	RuntimeToolContext,
	RuntimeToolContextOptions,
} from "@lumra/runtime";
import { createRuntimeX } from "@lumra/runtime";
import { tool } from "ai";
import z from "zod";

export const browserToolName = "browser";
export const browserToolDescription = [
	"Run JavaScript Puppeteer code.",
	"The tool input must be exactly { code: string }.",
	"The code is wrapped in an async function.",
	"Use `browser` as the Puppeteer module: `const b = await browser.launch({ headless: true }); const page = await b.newPage(); await page.goto('https://example.com'); const title = await page.title(); await b.close(); return { title };`.",
	"Always return JSON-serializable data and close browsers/pages you create.",
].join(" ");

export interface CreateBrowserToolOptions extends RuntimeToolContextOptions {
	context?: RuntimeToolContext;
}

export const browserInputSchema = z.object({
	code: z
		.string()
		.describe(
			"JavaScript Puppeteer code to run. It is wrapped in an async function with `browser` bound to the Puppeteer module. Create and close your own browser/page, and return JSON-serializable data."
		),
});

export type BrowserToolInput = z.infer<typeof browserInputSchema>;
export type BrowserToolOutput = Awaited<ReturnType<typeof executeBrowserTool>>;

/**
 * Create the Lumra browser tool backed by runtime browser executor actions.
 */
export function createBrowserTool(options: CreateBrowserToolOptions) {
	return tool({
		description: browserToolDescription,
		inputSchema: browserInputSchema,
		execute: (input) => executeBrowserTool(options, input),
	});
}

export async function executeBrowserTool(
	options: CreateBrowserToolOptions,
	input: BrowserToolInput
) {
	const x = await getRuntimeX(options);
	const result = await x.exec("browser run", {
		stdin: JSON.stringify(input),
	});

	if (result.exitCode !== 0) {
		throw new Error(result.stderr || "Browser code failed.");
	}

	return result.stdout ? JSON.parse(result.stdout) : {};
}

function getRuntimeX(options: CreateBrowserToolOptions) {
	if (options.context) {
		return options.context.getX();
	}

	return createRuntimeX({
		sessionId: options.sessionId,
		...(options.workspacePath ? { workspacePath: options.workspacePath } : {}),
	});
}
