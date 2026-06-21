import z from "zod";

export const modelIdSchema = z
	.tuple([
		z.string().describe("The provider id"),
		z.string().describe("The model id"),
	])
	.describe("A model id in the form of [provider-id, model-id]");

export const modelSetSchema = z
	.array(modelIdSchema)
	.describe("An ordered model list. Each item is [provider-id, model-id].");

export const builtInToolSchema = z.enum([
	"bash",
	"browser",
	"chat",
	"patch",
	"tasks",
	"view",
]);

export const approvalActionSchema = z.enum(["allow", "ask", "deny"]);

export const defaultToolPermission = {
	defaultAction: "allow" as const,
};

export const bashApprovalSchema = z.object({
	rules: z
		.record(z.string(), approvalActionSchema)
		.optional()
		.describe("Static command rules keyed by structured command patterns"),
	defaultAction: approvalActionSchema.default("allow"),
	dynamicAction: approvalActionSchema.optional(),
});

export const toolPermissionSchema = z.object({
	defaultAction: approvalActionSchema.default("allow"),
});

export const mcpPermissionSchema = z.object({
	defaultAction: approvalActionSchema.default("allow"),
	tools: z
		.record(z.string(), toolPermissionSchema)
		.default({})
		.describe("MCP tool permissions keyed by MCP tool name"),
});

export const defaultPermission = {
	bash: defaultToolPermission,
	browser: defaultToolPermission,
	chat: defaultToolPermission,
	patch: defaultToolPermission,
	tasks: defaultToolPermission,
	view: defaultToolPermission,
	mcp: {
		defaultAction: "allow" as const,
		tools: {},
	},
};

export const permissionSchema = z.object({
	bash: bashApprovalSchema.default(defaultToolPermission),
	browser: toolPermissionSchema.default(defaultToolPermission),
	chat: toolPermissionSchema.default(defaultToolPermission),
	patch: toolPermissionSchema.default(defaultToolPermission),
	tasks: toolPermissionSchema.default(defaultToolPermission),
	view: toolPermissionSchema.default(defaultToolPermission),
	mcp: mcpPermissionSchema.default(defaultPermission.mcp),
});
