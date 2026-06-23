import type { X } from "ai-sdk-x";
import type { RuntimeFeature, RuntimeFeatureContext } from ".";

export async function registerRuntimeFeatures(
	x: X,
	features: RuntimeFeature[],
	context: RuntimeFeatureContext
): Promise<X> {
	let next = x;

	for (const feature of features) {
		if (feature.register) {
			next = await feature.register(next, context);
		}
	}

	return next;
}
