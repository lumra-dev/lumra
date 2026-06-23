import { createGitFeature } from "ai-sdk-x";
import type { RuntimeFeature } from ".";

export const gitRuntimeFeature: RuntimeFeature = {
	name: "git",
	register(x) {
		return x.registerFeature(createGitFeature(true));
	},
};
