import { env } from "@lumra/env/server";
import { createRuntimeX as createRuntimeXWithAdapter } from "./create-runtime-x";
import type {
	RuntimeAdapter,
	RuntimeAdapterFactory,
	RuntimeXContext,
} from "./types/runtime";

export type RuntimePlatform = typeof env.PLATFORM;
export let runtime: RuntimeAdapter | null = null;

export async function getRuntime(
	platform: RuntimePlatform = env.PLATFORM
): Promise<RuntimeAdapter> {
	if (runtime) {
		return runtime;
	}

	const createRuntimeAdapter = await loadRuntimeAdapterFactory(platform);

	runtime = await createRuntimeAdapter();

	return runtime;
}

export async function createRuntimeX(context: RuntimeXContext) {
	const runtimeAdapter = await getRuntime();

	return createRuntimeXWithAdapter(runtimeAdapter, context);
}

async function loadRuntimeAdapterFactory(
	platform: RuntimePlatform
): Promise<RuntimeAdapterFactory> {
	switch (platform) {
		case "LOCAL":
			return (await import("@lumra/runtime-local")).createRuntimeAdapter;
		case "VERCEL":
			return (await import("@lumra/runtime-vercel")).createRuntimeAdapter;
		// case "EMBED"
		// case "CLOUD"
		default:
			throw new Error(`Unsupported runtime platform: ${String(platform)}`);
	}
}
