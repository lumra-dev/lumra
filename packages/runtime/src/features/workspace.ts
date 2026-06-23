import { createWorkspaceFeature } from "ai-sdk-x";
import type { RuntimeFeature } from ".";

export const workspaceRuntimeFeature: RuntimeFeature = {
	name: "workspace",
	register(x, context) {
		return x.registerFeature(
			createWorkspaceFeature({ fs: context.workspaceFs })
		);
	},
};
