import { tool } from "ai";
import type { ChatWorkflowInput } from "../../../types";
import {
	bashInputSchema,
	bashToolDescription,
	createBashTools,
	executeBashTool,
} from "./bash";
import {
	browserInputSchema,
	browserToolDescription,
	createBrowserTool,
	executeBrowserTool,
} from "./browser";
import {
	createPatchTool,
	executePatchTool,
	patchInputSchema,
	patchToolDescription,
} from "./patch";

export type LumraToolName = "bash" | "browser" | "patch";

export interface LumraToolCall {
	input: unknown;
	toolCallId: string;
	toolName: string;
}

export function createWorkflowTools(input: ChatWorkflowInput) {
	const tools = {
		...createBashTools({
			sessionId: input.sessionId,
			workspacePath: input.workspacePath,
		}),
		browser: createBrowserTool({
			sessionId: input.sessionId,
			workspacePath: input.workspacePath,
		}),
		patch: createPatchTool({
			sessionId: input.sessionId,
			workspacePath: input.workspacePath,
		}),
	};

	return tools;
}

export function createModelTools() {
	return {
		bash: tool({
			description: bashToolDescription,
			inputSchema: bashInputSchema,
		}),
		browser: tool({
			description: browserToolDescription,
			inputSchema: browserInputSchema,
		}),
		patch: tool({
			description: patchToolDescription,
			inputSchema: patchInputSchema,
		}),
	};
}

export async function executeWorkflowTool(
	input: ChatWorkflowInput,
	call: LumraToolCall
) {
	const options = {
		sessionId: input.sessionId,
		...(input.workspacePath ? { workspacePath: input.workspacePath } : {}),
	};

	switch (call.toolName) {
		case "bash":
			return await executeBashTool(options, bashInputSchema.parse(call.input));
		case "browser":
			return await executeBrowserTool(
				options,
				browserInputSchema.parse(call.input)
			);
		case "patch":
			return await executePatchTool(
				options,
				patchInputSchema.parse(call.input)
			);
		default:
			throw new Error(`Unknown Lumra tool: ${call.toolName}`);
	}
}

export type { BashToolInput, CreateBashToolsOptions } from "./bash";
export type { BrowserToolInput, CreateBrowserToolOptions } from "./browser";
export type { CreatePatchToolOptions, PatchToolInput } from "./patch";
