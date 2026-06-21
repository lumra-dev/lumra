import { env } from "@lumra/env/server";
import type { RuntimeAdapter } from "./types/runtime";

export type { RuntimeAdapter } from "./types/runtime";

export type RuntimePlatform = "LOCAL" | "VERCEL";

type RuntimeAdapterFactory = () => Promise<RuntimeAdapter> | RuntimeAdapter;

/**
 * Load the runtime adapter selected by the current platform.
 */
export async function getRuntime(
	platform: RuntimePlatform = getRuntimePlatform()
): Promise<RuntimeAdapter> {
	const createRuntimeAdapter = await loadRuntimeAdapterFactory(platform);

	return await createRuntimeAdapter();
}

/**
 * Default runtime adapter promise selected from the server environment.
 */
export const runtime = getRuntime();

async function loadRuntimeAdapterFactory(
	platform: RuntimePlatform
): Promise<RuntimeAdapterFactory> {
	switch (platform) {
		case "LOCAL":
			return (await import("@lumra/runtime-local")).createRuntimeAdapter;
		case "VERCEL":
			return (await import("@lumra/runtime-vercel")).createRuntimeAdapter;
		default:
			throw new Error(`Unsupported runtime platform: ${String(platform)}`);
	}
}

function getRuntimePlatform(): RuntimePlatform {
	return env.PLATFORM;
}
