import type { IFileSystem, X } from "ai-sdk-x";
import type { RuntimeExecutorExtension } from "../executor/types";
import type { RuntimeAdapter, RuntimeXContext } from "../types/runtime";
import { browserRuntimeFeature } from "./browser/extension";
import { gitRuntimeFeature } from "./git";
import { memoryRuntimeFeature } from "./memory";
import { patchRuntimeFeature } from "./patch";
import { skillsRuntimeFeature } from "./skills";
import { workspaceRuntimeFeature } from "./workspace";

export interface RuntimeFeatureContext extends RuntimeXContext {
	adapter: RuntimeAdapter;
	fs: IFileSystem;
	sessionMemoryFs: IFileSystem;
	skillsFs: IFileSystem;
	workspaceFs: IFileSystem;
}

export interface RuntimeFeature {
	executor?: RuntimeExecutorExtension;
	name: string;
	register?: (x: X, context: RuntimeFeatureContext) => Promise<X> | X;
}

export const builtInRuntimeFeatures: RuntimeFeature[] = [
	patchRuntimeFeature,
	gitRuntimeFeature,
	workspaceRuntimeFeature,
	skillsRuntimeFeature,
	memoryRuntimeFeature,
	browserRuntimeFeature,
];
