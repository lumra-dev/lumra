import { createMemoryFeature } from "ai-sdk-x";
import type { RuntimeFeature } from ".";

export const memoryRuntimeFeature: RuntimeFeature = {
	name: "memory",
	register(x, context) {
		return x.registerFeature(
			createMemoryFeature({ fs: context.sessionMemoryFs })
		);
	},
};
