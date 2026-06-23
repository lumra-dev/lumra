import { createSkillsFeature } from "ai-sdk-x";
import type { RuntimeFeature } from ".";

export const skillsRuntimeFeature: RuntimeFeature = {
	name: "skills",
	register(x, context) {
		return x.registerFeature(createSkillsFeature({ fs: context.skillsFs }));
	},
};
