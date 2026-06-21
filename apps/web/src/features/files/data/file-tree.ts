import type { MockFileNode } from "../types/file-node";

export const DEFAULT_EXPANDED_FILE_PATHS = new Set([
	"/",
	"/apps",
	"/apps/web",
	"/apps/web/src",
]);

export const MOCK_FILE_TREE: MockFileNode = {
	name: "/",
	path: "/",
	type: "folder",
	children: [
		{
			name: "apps",
			path: "/apps",
			type: "folder",
			children: [
				{
					name: "web",
					path: "/apps/web",
					type: "folder",
					children: [
						{
							name: "src",
							path: "/apps/web/src",
							type: "folder",
							children: [
								{
									name: "app",
									path: "/apps/web/src/app",
									type: "folder",
									children: [
										{
											name: "dashboard-client.tsx",
											path: "/apps/web/src/features/dashboard-shell/components/dashboard-client.tsx",
											type: "file",
										},
										{
											name: "page.tsx",
											path: "/apps/web/src/app/dashboard/page.tsx",
											type: "file",
										},
										{
											name: "route.ts",
											path: "/apps/web/src/app/api/chat/route.ts",
											type: "file",
										},
									],
								},
							],
						},
					],
				},
			],
		},
		{
			name: "packages",
			path: "/packages",
			type: "folder",
			children: [
				{
					name: "agent",
					path: "/packages/agent",
					type: "folder",
					children: [
						{
							name: "index.ts",
							path: "/packages/agent/src/index.ts",
							type: "file",
						},
					],
				},
				{
					name: "webui",
					path: "/packages/webui",
					type: "folder",
					children: [
						{
							name: "ai-elements",
							path: "/packages/webui/src/components/ai-elements",
							type: "file",
						},
					],
				},
			],
		},
		{ name: "package.json", path: "/package.json", type: "file" },
		{ name: "turbo.json", path: "/turbo.json", type: "file" },
	],
};
