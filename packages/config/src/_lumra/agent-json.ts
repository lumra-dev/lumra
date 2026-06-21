import z from "zod";

import { modelIdSchema, permissionSchema } from "../shared/schema";

const createTimestamp = () => new Date().toISOString();

export const hookSchema = z.object({
	name: z.string(),
	enabled: z.boolean().default(true),
	config: z.record(z.string(), z.unknown()).optional(),
});

export const subAgentSchema = z.object({
	name: z.string(),
	modelId: modelIdSchema,
	toolSet: z
		.array(z.string())
		.default([])
		.describe(
			"Built-in tool names or MCP tool names available to this sub-agent"
		),
	systemPrompt: z.string().default(""),
	permission: permissionSchema.optional(),
	hooks: z.array(hookSchema).default([]),
});

export const agentSchema = z.object({
	updated: z.iso.datetime().default(createTimestamp),
	created: z.iso.datetime().default(createTimestamp),
	subAgents: z.array(subAgentSchema).default([]),
});

export default agentSchema;
export type AgentSchema = z.infer<typeof agentSchema>;
