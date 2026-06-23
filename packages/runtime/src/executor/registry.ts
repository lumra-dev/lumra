import type { RuntimeExecutorAction, RuntimeExecutorContext } from "./types";

export class RuntimeExecutorRegistry {
	private readonly actions = new Map<string, RuntimeExecutorAction>();
	private readonly context: RuntimeExecutorContext;

	constructor(
		actions: RuntimeExecutorAction[],
		context: RuntimeExecutorContext
	) {
		for (const action of actions) {
			assertActionPath(action.path);

			if (this.actions.has(action.path)) {
				throw new Error(`Duplicate runtime executor action: ${action.path}`);
			}

			this.actions.set(action.path, action);
		}
		this.context = context;
	}

	getActions(): RuntimeExecutorAction[] {
		return [...this.actions.values()];
	}

	async invokeTool(path: string, argsJson: string): Promise<string> {
		const action = this.actions.get(path);

		if (!action) {
			throw new Error(`Unknown runtime executor action: ${path}`);
		}

		const input = parseActionInput(argsJson);
		const output = await action.execute(input, this.context);

		return output === undefined ? "" : JSON.stringify(output);
	}
}

function assertActionPath(path: string): void {
	const [namespace, command] = path.split(".");

	if (!(namespace && command)) {
		throw new Error(`Runtime executor action path must be namespaced: ${path}`);
	}
}

function parseActionInput(argsJson: string): unknown {
	if (!argsJson) {
		return {};
	}

	return JSON.parse(argsJson);
}
