import z from "zod";

import { env } from "../shared/env";
import {
	defaultPermission,
	modelSetSchema,
	permissionSchema,
} from "../shared/schema";

const createTimestamp = () => new Date().toISOString();

// Model and Provider
export const modelSchema = z.object({
	id: z.string().describe("The id for the model"),
	capabilities: z
		.array(
			z.enum([
				"reasoning",
				"tool_calling",
				"structured",

				//  multimodal
				"text",
				"image",
				"video",
				"audio",
				"pdf",

				// embeddings
				"embedding",
			])
		)
		.describe("The supported capabilities")
		.default(["text"]),
	maxInputTokens: z.number().describe("The maximum input tokens"),
	maxOutputTokens: z.number().describe("The maximum output tokens"),

	price: z
		.object({
			input: z.number(),
			output: z.number().optional(),
		})
		.optional(),
});

export const providerSchema = z.object({
	id: z.string().describe("The unique identifier for the provider"),
	type: z
		.enum(["openai", "openai-compatible", "claude", "gemini"])
		.describe("The type of the provider"),
	baseUrl: env(),
	apiKey: env(),
	headers: z
		.record(z.string(), env())
		.describe("Additional headers")
		.optional(),
	models: z.array(modelSchema).default([]),
});

export const apiSchema = z.object({
	providers: z.array(providerSchema).default([]),
	modelSet: modelSetSchema
		.default([])
		.describe(
			"Ordered model fallback list. Each item is [provider-id, model-id], and later items are tried when earlier APIs fail."
		),
});

// Theme

export const themeSchema = z.object({
	mode: z.enum(["light", "dark", "system"]).default("system"),
});

// MCP

export const mcpAuthSchema = z.discriminatedUnion("type", [
	z.object({
		type: z.literal("none"),
	}),
	z.object({
		type: z.literal("oauth"),
		clientId: z.string().optional(),
		clientSecret: env().optional(),
		scopes: z.array(z.string()).default([]),
		tokenUrl: env().optional(),
		authorizationUrl: env().optional(),
	}),
	z.object({
		type: z.literal("headers"),
		headers: z.record(z.string(), env()).default({}),
	}),
]);

export const mcpToolSchema = z.object({
	name: z.string(),
	description: z.string().optional(),
	inputSchema: z.record(z.string(), z.unknown()).optional(),
	cacheSchema: z
		.boolean()
		.default(false)
		.describe("Whether this tool schema should be cached in settings.json"),
});

export const mcpServerSchema = z.object({
	id: z.string(),
	name: z.string().optional(),
	url: env(),
	auth: mcpAuthSchema.default({ type: "none" }),
	format: z.enum(["streamable-http", "sse"]).default("streamable-http"),
	tools: z.array(mcpToolSchema).default([]),
});

export const mcpSchema = z.object({
	servers: z.array(mcpServerSchema).default([]),
});

export const settingSchema = z.object({
	onboarding: z
		.boolean()
		.default(false)
		.describe("Whether the user has completed onboarding"),

	api: apiSchema.default({ providers: [], modelSet: [] }),
	theme: themeSchema.default({ mode: "system" }),
	mcp: mcpSchema.default({ servers: [] }),
	permission: permissionSchema.default(defaultPermission),
	updateTime: z.iso.datetime().default(createTimestamp),
	createTime: z.iso.datetime().default(createTimestamp),
});
export default settingSchema;
export type SettingSchema = z.infer<typeof settingSchema>;
