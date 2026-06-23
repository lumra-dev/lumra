import type { RuntimeConfigFile } from "@lumra/hub";

export interface RuntimeConfigDescriptor {
	description: string;
	file: RuntimeConfigFile;
	label: string;
}

export const runtimeConfigDescriptors = [
	{
		description: "Provider, model, MCP, permission, and theme settings.",
		file: "setting",
		label: "setting.json",
	},
	{
		description:
			"Hub identity, public endpoint, agent nodes, and heartbeat data.",
		file: "hub",
		label: "hub.json",
	},
	{
		description:
			"Sub-agent definitions, hooks, model assignments, and permissions.",
		file: "agent",
		label: "agent.json",
	},
] satisfies RuntimeConfigDescriptor[];
