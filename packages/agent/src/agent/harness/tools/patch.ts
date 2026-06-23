import {
	createRuntimeX,
	type RuntimeToolContext,
	type RuntimeToolContextOptions,
} from "@lumra/runtime";
import { tool } from "ai";
import z from "zod";

export interface CreatePatchToolOptions extends RuntimeToolContextOptions {
	context?: RuntimeToolContext;
}

export const patchToolDescription =
	"Apply a structured x-patch patch in the Lumra virtual Bash runtime.";

export const patchInputSchema = z.object({
	cwd: z
		.string()
		.optional()
		.describe("Optional working directory for applying the patch."),
	patch: z.string().describe("The full x-patch document to apply."),
});

export type PatchToolInput = z.infer<typeof patchInputSchema>;
export type PatchToolOutput = Awaited<ReturnType<typeof executePatchTool>>;

/**
 * Create the Lumra patch tool backed by AI SDK X `x-patch`.
 */
export function createPatchTool(options: CreatePatchToolOptions) {
	return tool({
		description: patchToolDescription,
		inputSchema: patchInputSchema,
		execute: (input) => executePatchTool(options, input),
	});
}

export async function executePatchTool(
	options: CreatePatchToolOptions,
	{ cwd, patch }: PatchToolInput
) {
	const x = await getRuntimeX(options);
	const result = await x.exec("x-patch", {
		...(cwd === undefined ? {} : { cwd }),
		stdin: patch,
	});

	return {
		exitCode: result.exitCode,
		stderr: result.stderr,
		stdout: result.stdout,
	};
}

function getRuntimeX(options: CreatePatchToolOptions) {
	if (options.context) {
		return options.context.getX();
	}

	return createRuntimeX({
		sessionId: options.sessionId,
		...(options.workspacePath ? { workspacePath: options.workspacePath } : {}),
	});
}
