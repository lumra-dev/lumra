import { createPatchFeature } from "ai-sdk-x";
import type { RuntimeFeature } from ".";

export const patchRuntimeFeature: RuntimeFeature = {
	name: "patch",
	register(x) {
		return x.registerFeature(createPatchFeature(true));
	},
};
