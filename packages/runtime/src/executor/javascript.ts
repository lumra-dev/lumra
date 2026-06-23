import type { BashOptions } from "ai-sdk-x";
import type { RuntimeExecutorRegistry } from "./registry";

export function createRuntimeExecutorJavaScriptConfig(
	bootstrap: string,
	registry: RuntimeExecutorRegistry
): NonNullable<BashOptions["javascript"]> {
	return {
		bootstrap,
		invokeTool: (path, argsJson) => registry.invokeTool(path, argsJson),
	};
}
