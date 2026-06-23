import {
	type CliDefinition,
	type Command,
	type CommandContext,
	commandError,
	createCommand,
	decodeBytesToUtf8,
	defineCliCommand,
	defineCliTopic,
	type ExecResult,
} from "ai-sdk-x";
import type { RuntimeExecutorRegistry } from "./registry";
import type { RuntimeExecutorAction } from "./types";

interface RuntimeExecutorCommandEntry {
	action: RuntimeExecutorAction;
	segments: string[];
}

interface TopicNode {
	action?: RuntimeExecutorAction;
	children: Map<string, TopicNode>;
	id: string;
}

export function createRuntimeExecutorCommands(
	registry: RuntimeExecutorRegistry
): Command[] {
	const root = createTopicNode("");

	for (const action of registry.getActions()) {
		insertTopicEntry(root, toCommandEntry(action));
	}

	return [...root.children.values()].map((node) =>
		createCommand(toCliDefinition(node, registry))
	);
}

function createRuntimeExecutorLeafCommand(
	entry: RuntimeExecutorCommandEntry,
	registry: RuntimeExecutorRegistry
): CliDefinition {
	return defineCliCommand({
		id: entry.segments.at(-1) ?? entry.action.path,
		type: "command",
		summary: entry.action.description ?? `Run ${entry.action.path}.`,
		flags: {
			json: {
				type: "string",
				summary: "JSON input for the runtime action.",
			},
		},
		run: async ({ flags }, ctx): Promise<ExecResult> => {
			try {
				const argsJson = readActionArgsJson(flags.json, ctx.stdin);
				const resultJson = await registry.invokeTool(
					entry.action.path,
					argsJson
				);
				const stdout = resultJson ? `${resultJson}\n` : "";

				return { exitCode: 0, stderr: "", stdout };
			} catch (error) {
				const message = error instanceof Error ? error.message : String(error);

				return commandError(`${message}\n`, 1);
			}
		},
	});
}

function toCommandEntry(
	action: RuntimeExecutorAction
): RuntimeExecutorCommandEntry {
	const segments = action.path.split(".");

	if (segments.length < 2 || segments.some((segment) => !segment)) {
		throw new Error(
			`Runtime executor action path must be namespaced: ${action.path}`
		);
	}

	return { action, segments };
}

function createTopicNode(id: string): TopicNode {
	return {
		children: new Map(),
		id,
	};
}

function insertTopicEntry(
	root: TopicNode,
	entry: RuntimeExecutorCommandEntry
): void {
	let current = root;

	for (const segment of entry.segments) {
		let next = current.children.get(segment);

		if (!next) {
			next = createTopicNode(segment);
			current.children.set(segment, next);
		}

		current = next;
	}

	if (current.action) {
		throw new Error(
			`Duplicate runtime executor command path: ${entry.action.path}`
		);
	}

	current.action = entry.action;
}

function toCliDefinition(
	node: TopicNode,
	registry: RuntimeExecutorRegistry
): CliDefinition {
	if (node.action && node.children.size === 0) {
		return createRuntimeExecutorLeafCommand(
			{
				action: node.action,
				segments: node.action.path.split("."),
			},
			registry
		);
	}

	return defineCliTopic({
		id: node.id,
		type: "topic",
		summary: `Run ${node.id} runtime actions.`,
		subcommands: [...node.children.values()].map((child) =>
			toCliDefinition(child, registry)
		),
	});
}

function readActionArgsJson(
	json: string | undefined,
	stdin: CommandContext["stdin"]
): string {
	if (json !== undefined) {
		return json;
	}

	const stdinText = decodeBytesToUtf8(stdin).trim();

	return stdinText || "{}";
}
