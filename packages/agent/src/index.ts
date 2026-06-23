import { createLanguageModel } from "@lumra/provider";
import {
	type FinishReason,
	generateId,
	generateText,
	type JSONValue,
	type LanguageModelUsage,
	type ModelMessage,
	type ToolResultPart,
	type UIMessageChunk,
} from "ai";
import { getWritable } from "workflow";
import {
	createModelTools,
	executeWorkflowTool,
	type LumraToolCall,
} from "./agent/harness/tools";
import type { ChatWorkflowInput } from "./types";

export type {
	ChatWorkflowInput,
	WorkflowModelConfig,
	WorkflowModelMessage,
} from "./types";

interface WorkflowConfig {
	maxSteps: number;
}

interface AgentCallResult {
	finishReason: FinishReason;
	messages: ModelMessage[];
	text: string;
	toolCalls: LumraToolCall[];
	usage: LanguageModelUsage;
}

interface ToolStepResult {
	errorText?: string;
	output?: unknown;
	toolCall: LumraToolCall;
}

export async function chatWorkflow(input: ChatWorkflowInput) {
	"use workflow";

	const config: WorkflowConfig = {
		maxSteps: 20,
	};
	const writable = getWritable<UIMessageChunk>();
	let messages = input.messages as ModelMessage[];

	await startWorkflowStream(writable);

	for (let stepIndex = 0; stepIndex < config.maxSteps; stepIndex++) {
		const call = await runModelStepSafely(input, messages);

		if (!call.ok) {
			await finishWorkflowStreamWithError(writable, call.errorText);

			return { messages };
		}

		await writeModelCallChunks(writable, call.result);
		messages = [...messages, ...call.result.messages];

		if (call.result.toolCalls.length === 0) {
			await finishWorkflowStream(writable, call.result.finishReason);

			return { messages };
		}

		const toolResults: ToolStepResult[] = [];

		for (const toolCall of call.result.toolCalls) {
			await writeToolInput(writable, toolCall);

			const toolResult = await runToolStep(input, toolCall);
			toolResults.push(toolResult);

			await writeToolOutput(writable, toolResult);
		}

		messages = [...messages, toToolMessage(toolResults)];
	}

	await finishWorkflowStream(writable, "length");

	return { messages };
}

async function runModelStepSafely(
	input: ChatWorkflowInput,
	messages: ModelMessage[]
): Promise<
	{ ok: true; result: AgentCallResult } | { errorText: string; ok: false }
> {
	"use step";

	try {
		return {
			ok: true,
			result: await runModelCall(input, messages),
		};
	} catch (error) {
		return {
			errorText: getErrorMessage(error),
			ok: false,
		};
	}
}

async function runModelCall(
	input: ChatWorkflowInput,
	messages: ModelMessage[]
): Promise<AgentCallResult> {
	const model = await createLanguageModel(input.model);
	const result = await generateText({
		model,
		messages,
		tools: createModelTools(),
	});

	return {
		finishReason: result.finishReason,
		messages: result.response.messages,
		text: result.text,
		toolCalls: result.toolCalls.map(
			({ input: toolInput, toolCallId, toolName }) => ({
				input: toolInput,
				toolCallId,
				toolName,
			})
		),
		usage: result.usage,
	};
}

async function startWorkflowStream(writable: WritableStream<UIMessageChunk>) {
	"use step";

	const writer = writable.getWriter();
	await writer.write({ type: "start", messageId: generateId() });
	writer.releaseLock();
}

async function runToolStep(
	input: ChatWorkflowInput,
	toolCall: LumraToolCall
): Promise<ToolStepResult> {
	"use step";

	try {
		return {
			output: await executeWorkflowTool(input, toolCall),
			toolCall,
		};
	} catch (error) {
		return {
			errorText: getErrorMessage(error),
			toolCall,
		};
	}
}

async function writeModelCallChunks(
	writable: WritableStream<UIMessageChunk>,
	call: AgentCallResult
) {
	"use step";

	const writer = writable.getWriter();
	const chunks: UIMessageChunk[] = [{ type: "start-step" }];

	if (call.text) {
		const textId = generateId();
		chunks.push(
			{ type: "text-start", id: textId },
			{ type: "text-delta", delta: call.text, id: textId },
			{ type: "text-end", id: textId }
		);
	}

	chunks.push({ type: "finish-step" });

	for (const chunk of chunks) {
		await writer.write(chunk);
	}

	writer.releaseLock();
}

async function writeToolInput(
	writable: WritableStream<UIMessageChunk>,
	toolCall: LumraToolCall
) {
	"use step";

	const writer = writable.getWriter();
	await writer.write({
		type: "tool-input-available",
		input: toolCall.input,
		toolCallId: toolCall.toolCallId,
		toolName: toolCall.toolName,
	});
	writer.releaseLock();
}

async function writeToolOutput(
	writable: WritableStream<UIMessageChunk>,
	{ errorText, output, toolCall }: ToolStepResult
) {
	"use step";

	const writer = writable.getWriter();

	if (errorText) {
		await writer.write({
			type: "tool-output-error",
			errorText,
			toolCallId: toolCall.toolCallId,
		});
	} else {
		await writer.write({
			type: "tool-output-available",
			output,
			toolCallId: toolCall.toolCallId,
		});
	}

	writer.releaseLock();
}

async function finishWorkflowStream(
	writable: WritableStream<UIMessageChunk>,
	finishReason: FinishReason
) {
	"use step";

	const writer = writable.getWriter();
	await writer.write({ type: "finish", finishReason });
	writer.releaseLock();
	await writable.close();
}

async function finishWorkflowStreamWithError(
	writable: WritableStream<UIMessageChunk>,
	errorText: string
) {
	"use step";

	const writer = writable.getWriter();
	await writer.write({ type: "error", errorText });
	await writer.write({ type: "finish", finishReason: "error" });
	writer.releaseLock();
	await writable.close();
}

function toToolMessage(results: ToolStepResult[]): ModelMessage {
	return {
		content: results.map(toToolResultPart),
		role: "tool",
	};
}

function toToolResultPart({
	errorText,
	output,
	toolCall,
}: ToolStepResult): ToolResultPart {
	return {
		output: errorText
			? { type: "error-text", value: errorText }
			: { type: "json", value: toJsonValue(output) },
		toolCallId: toolCall.toolCallId,
		toolName: toolCall.toolName,
		type: "tool-result",
	};
}

function getErrorMessage(error: unknown) {
	return error instanceof Error ? error.message : String(error);
}

function toJsonValue(value: unknown): JSONValue {
	if (value === undefined) {
		return null;
	}

	return value as JSONValue;
}
