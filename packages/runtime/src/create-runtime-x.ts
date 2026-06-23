import { createSubpathFs, X } from "ai-sdk-x";
import { createRuntimeExecutor } from "./executor";
import { builtInRuntimeFeatures, type RuntimeFeatureContext } from "./features";
import { registerRuntimeFeatures } from "./features/register";
import { GLOBAL_SKILLS_DIR } from "./layout/constants";
import { ensureLumraLayout } from "./layout/ensure-layout";
import { sessionMemoryPath } from "./layout/paths";
import type { RuntimeAdapter, RuntimeXContext } from "./types/runtime";

/**
 * Create a feature-complete AI SDK X runtime for a Lumra session.
 */
export async function createRuntimeX(
	runtimeAdapter: RuntimeAdapter,
	context: RuntimeXContext
): Promise<X> {
	await ensureLumraLayout(runtimeAdapter, context);

	const workspaceFs = await runtimeAdapter.ability.resolve({
		path: context.workspacePath,
		sessionId: context.sessionId,
	});
	const sessionMemoryFs = createSubpathFs(
		runtimeAdapter.fs,
		sessionMemoryPath(context.sessionId)
	);
	const skillsFs = createSubpathFs(runtimeAdapter.fs, GLOBAL_SKILLS_DIR);
	const featureContext: RuntimeFeatureContext = {
		...context,
		adapter: runtimeAdapter,
		fs: runtimeAdapter.fs,
		sessionMemoryFs,
		skillsFs,
		workspaceFs,
	};
	const features = [
		...builtInRuntimeFeatures,
		...(runtimeAdapter.features ?? []),
		...(context.features ?? []),
	];
	const executor = createRuntimeExecutor(
		featureContext,
		features.flatMap((feature) => (feature.executor ? [feature.executor] : []))
	);
	let x = new X({
		bash: {
			// coverage
			sleep: async () => {
				await Promise.resolve();
			},
			defenseInDepth: false,
			javascript: executor.javascript,
		},
	});

	for (const command of executor.commands) {
		x = x.registerCommand(command);
	}

	return registerRuntimeFeatures(x, features, featureContext);
}
