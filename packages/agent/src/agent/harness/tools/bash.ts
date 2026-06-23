import {
	createRuntimeX,
	type RuntimeToolContext,
	type RuntimeToolContextOptions,
} from "@lumra/runtime";
import { tool } from "ai";
import z from "zod";

export interface CreateBashToolsOptions extends RuntimeToolContextOptions {
	context?: RuntimeToolContext;
}

export const bashToolDescription =
	"Run a command in the Lumra virtual Bash runtime. Use x-patch for file modifications.";

export const bashInputSchema = z.object({
	command: z
		.string()
		.describe("The full bash command to execute in the runtime."),
	cwd: z
		.string()
		.optional()
		.describe("Optional working directory for this command."),
	stdin: z
		.string()
		.optional()
		.describe("Optional raw stdin text passed to the command."),
});

export type BashToolInput = z.infer<typeof bashInputSchema>;
export type BashToolOutput = Awaited<ReturnType<typeof executeBashTool>>;

/**
 * Create the Lumra Bash tool backed by the session runtime X instance.
 */
export function createBashTools(options: CreateBashToolsOptions) {
	const bash = tool({
		description: bashToolDescription,
		inputSchema: bashInputSchema,
		execute: (input) => executeBashTool(options, input),
	});

	return { bash };
}

export async function executeBashTool(
	options: CreateBashToolsOptions,
	{ command, cwd, stdin }: BashToolInput
) {
	const x = await getRuntimeX(options);
	const result = await x.exec(command, {
		...(cwd === undefined ? {} : { cwd }),
		...(stdin === undefined ? {} : { stdin }),
	});

	return {
		exitCode: result.exitCode,
		stderr: result.stderr,
		stdout: result.stdout,
	};
}

function getRuntimeX(options: CreateBashToolsOptions) {
	if (options.context) {
		return options.context.getX();
	}

	return createRuntimeX({
		sessionId: options.sessionId,
		...(options.workspacePath ? { workspacePath: options.workspacePath } : {}),
	});
}
