import type { CreateModelOptions } from "@lumra/provider";

export type WorkflowModelConfig = CreateModelOptions;

export interface WorkflowModelMessage {
	content: unknown;
	role: "assistant" | "system" | "tool" | "user";
}

export interface ChatWorkflowInput {
	messages: WorkflowModelMessage[];
	model: WorkflowModelConfig;
}
