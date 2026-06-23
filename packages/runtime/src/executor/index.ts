import { createRuntimeExecutorCommands } from "./command";
import { createRuntimeExecutorJavaScriptConfig } from "./javascript";
import type { RuntimeExecutorRegistry } from "./registry";
import { RuntimeExecutorRegistry as Registry } from "./registry";
import type {
	RuntimeExecutorAction,
	RuntimeExecutorContext,
	RuntimeExecutorExtension,
} from "./types";

export type {
	Awaitable,
	RuntimeExecutorAction,
	RuntimeExecutorContext,
	RuntimeExecutorExtension,
} from "./types";

export interface RuntimeExecutor {
	bootstrap: string;
	commands: ReturnType<typeof createRuntimeExecutorCommands>;
	javascript: ReturnType<typeof createRuntimeExecutorJavaScriptConfig>;
	registry: RuntimeExecutorRegistry;
}

export function defineRuntimeAction<Input, Output>(
	action: RuntimeExecutorAction<Input, Output>
): RuntimeExecutorAction<Input, Output> {
	return action;
}

export function createRuntimeExecutor(
	context: RuntimeExecutorContext,
	extensions: RuntimeExecutorExtension[] = []
): RuntimeExecutor {
	const actions = extensions.flatMap((extension) => extension.actions ?? []);
	const bootstrap = extensions
		.map((extension) => extension.bootstrap?.trim())
		.filter(Boolean)
		.join("\n");
	const registry = new Registry(actions, context);

	return {
		bootstrap,
		commands: createRuntimeExecutorCommands(registry),
		javascript: createRuntimeExecutorJavaScriptConfig(bootstrap, registry),
		registry,
	};
}
