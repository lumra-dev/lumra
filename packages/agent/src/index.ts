import { createLanguageModel } from "@lumra/provider";
import { type CompatibleLanguageModel, DurableAgent } from "@workflow/ai/agent";
import type { UIMessageChunk } from "ai";
import { getWritable } from "workflow";
import type { ChatWorkflowInput } from "./types";

export type {
	ChatWorkflowInput,
	WorkflowModelConfig,
	WorkflowModelMessage,
} from "./types";

export async function chatWorkflow(input: ChatWorkflowInput) {
	"use workflow";

	const agent = new DurableAgent({
		model: createModelResolver(input.model),
	});
	const result = await agent.stream({
		messages: input.messages as never,
		writable: getWritable<UIMessageChunk>(),
	});

	return { messages: result.messages };
}

function createModelResolver(model: ChatWorkflowInput["model"]) {
	return async function resolveModel(): Promise<CompatibleLanguageModel> {
		"use step";

		// Provider models are non-serializable, so construct them inside a step.
		return (await createLanguageModel(model)) as CompatibleLanguageModel;
	};
}
