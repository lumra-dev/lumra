import {
	type ChatWorkflowInput,
	chatWorkflow,
	type WorkflowModelConfig,
} from "@lumra/agent";
import { JSONC } from "@lumra/config";
import type { AgentSchema } from "@lumra/config/_lumra/agent-json";
import agentSchema from "@lumra/config/_lumra/agent-json";
import type { HubSchema } from "@lumra/config/_lumra/hub-json";
import hubSchema from "@lumra/config/_lumra/hub-json";
import type { SettingSchema } from "@lumra/config/_lumra/setting-json";
import settingSchema from "@lumra/config/_lumra/setting-json";
import type { RuntimeAdapter } from "@lumra/runtime";
import { runtime } from "@lumra/runtime";
import { convertToModelMessages, type UIMessage } from "ai";
import type { WorkflowReadableStream } from "workflow/api";
import { start } from "workflow/api";

const CONFIG_DIR = ".lumra";
const CONFIG_FILES = {
	agent: `${CONFIG_DIR}/agent.jsonc`,
	hub: `${CONFIG_DIR}/hub.jsonc`,
	setting: `${CONFIG_DIR}/setting.jsonc`,
} as const;

export type RuntimeConfigFile = keyof typeof CONFIG_FILES;

export interface LumraConfig {
	agent: AgentSchema;
	hub: HubSchema;
	setting: SettingSchema;
}

export interface HubChatWorkflowRun {
	readable: WorkflowReadableStream;
	runId: string;
}

let hubPromise: Promise<Hub> | undefined;

/**
 * Return the process-local Hub instance backed by the selected runtime.
 */
export function getHub(): Promise<Hub> {
	hubPromise ??= createHub();

	return hubPromise;
}

/**
 * Coordinates runtime config and workflow execution for Lumra apps.
 */
export class Hub {
	private readonly runtimeAdapter: RuntimeAdapter;

	constructor(runtimeAdapter: RuntimeAdapter) {
		this.runtimeAdapter = runtimeAdapter;
	}

	/**
	 * Read and validate all Hub-managed Lumra configuration files.
	 */
	async getRuntimeConfig(): Promise<LumraConfig> {
		const [setting, hub, agent] = await Promise.all([
			this.readConfig(CONFIG_FILES.setting, settingSchema),
			this.readConfig(CONFIG_FILES.hub, hubSchema),
			this.readConfig(CONFIG_FILES.agent, agentSchema),
		]);

		return { agent, hub, setting };
	}

	/**
	 * Read a Hub-managed JSONC config file as source text.
	 */
	async getRuntimeConfigSource(file: RuntimeConfigFile): Promise<string> {
		const path = CONFIG_FILES[file];

		await this.ensureRuntimeConfigFile(file);

		return await this.runtimeAdapter.storage.readFile(path);
	}

	/**
	 * Validate and persist a Hub-managed JSONC config file.
	 */
	async saveRuntimeConfigSource(
		file: RuntimeConfigFile,
		source: string
	): Promise<void> {
		validateRuntimeConfigSource(file, source);

		await this.ensureConfigDir();
		await this.runtimeAdapter.storage.writeFile(
			CONFIG_FILES[file],
			source.endsWith("\n") ? source : `${source}\n`
		);
	}

	/**
	 * Start the durable chat workflow using the configured provider model.
	 */
	async startChatWorkflow(messages: UIMessage[]): Promise<HubChatWorkflowRun> {
		const config = await this.getRuntimeConfig();
		const model = resolveWorkflowModel(config.setting);
		// Keep workflow inputs serialized as model messages.
		const modelMessages = await convertToModelMessages(messages);
		const input: ChatWorkflowInput = { messages: modelMessages, model };
		const run = await start(chatWorkflow, [input]);

		return {
			readable: run.readable,
			runId: run.runId,
		};
	}

	private async readConfig<T>(
		path: string,
		schema: { parse(value: unknown): T }
	): Promise<T> {
		await this.ensureConfigDir();

		if (!(await this.runtimeAdapter.storage.exists(path))) {
			const value = schema.parse({});
			await this.writeConfig(path, value);

			return value;
		}

		const source = await this.runtimeAdapter.storage.readFile(path);

		return schema.parse(JSONC.parse(source));
	}

	private async writeConfig(path: string, value: unknown): Promise<void> {
		await this.runtimeAdapter.storage.writeFile(
			path,
			`${JSONC.stringify(value, null, "\t")}\n`
		);
	}

	private async ensureConfigDir(): Promise<void> {
		await this.runtimeAdapter.storage.mkdir(CONFIG_DIR, { recursive: true });
	}

	private async ensureRuntimeConfigFile(
		file: RuntimeConfigFile
	): Promise<void> {
		switch (file) {
			case "agent":
				await this.readConfig(CONFIG_FILES.agent, agentSchema);
				return;
			case "hub":
				await this.readConfig(CONFIG_FILES.hub, hubSchema);
				return;
			case "setting":
				await this.readConfig(CONFIG_FILES.setting, settingSchema);
				return;
			default:
				throw new Error(`Unknown runtime config file: ${file satisfies never}`);
		}
	}
}

async function createHub(): Promise<Hub> {
	return new Hub(await runtime);
}

function resolveWorkflowModel(setting: SettingSchema): WorkflowModelConfig {
	const modelEntry = setting.api.modelSet[0];

	if (!modelEntry) {
		throw new Error("No model configured in .lumra/setting.jsonc");
	}

	const [providerId, model] = modelEntry;
	const provider = setting.api.providers.find(
		({ id }: SettingSchema["api"]["providers"][number]) => id === providerId
	);

	if (!provider) {
		throw new Error(
			`Provider "${providerId}" is not configured in .lumra/setting.jsonc`
		);
	}

	return {
		apiKey: provider.apiKey,
		baseURL: provider.baseUrl,
		headers: provider.headers ?? {},
		model,
		name: provider.id,
		type: provider.type,
	};
}

function validateRuntimeConfigSource(
	file: RuntimeConfigFile,
	source: string
): void {
	const parsed = JSONC.parse(source);

	switch (file) {
		case "agent":
			agentSchema.parse(parsed);
			return;
		case "hub":
			hubSchema.parse(parsed);
			return;
		case "setting":
			settingSchema.parse(parsed);
			return;
		default:
			throw new Error(`Unknown runtime config file: ${file satisfies never}`);
	}
}
