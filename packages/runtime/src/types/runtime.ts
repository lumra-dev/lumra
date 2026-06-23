import type { IFileSystem, KVStorage } from "ai-sdk-x";
import type { RuntimeFeature } from "../features";

export type RuntimeAdapterFactory = () =>
	| Promise<RuntimeAdapter>
	| RuntimeAdapter;

/**
 * Runtime capabilities required by Lumra agents.
 */
export interface RuntimeAdapter {
	/**
	 * Runtime-specific capabilities used by Lumra.
	 */
	ability: RuntimeAbility;
	/**
	 * Optional key-value cache for runtime-specific derived data.
	 */
	cache?: KVStorage;
	/**
	 * Runtime-specific features appended to the built-in Lumra features.
	 */
	features?: RuntimeFeature[];
	/**
	 * Persistent filesystem that owns the fixed `.lumra` config.
	 */
	fs: IFileSystem;
	/**
	 * Human-readable runtime adapter name.
	 */
	name: string;
}

export interface RuntimeAbility {
	/**
	 * Browser runtime capability.
	 */
	browser?: unknown;
	/**
	 * Create or resolve a session workspace filesystem.
	 */
	resolve(input: RuntimeWorkspaceInput): Promise<IFileSystem> | IFileSystem;
}

export interface RuntimeWorkspaceInput {
	/**
	 * Optional real workspace path; local runtime may symlink to it.
	 */
	path?: string;
	/**
	 * Session identifier used to resolve the fixed workspace path.
	 */
	sessionId: string;
}

export interface RuntimeXContext {
	/**
	 * Optional per-session features appended after adapter features.
	 */
	features?: RuntimeFeature[];
	/**
	 * Session identifier used for workspace and memory layout.
	 */
	sessionId: string;
	/**
	 * Optional real workspace path for runtimes that support external workspaces.
	 */
	workspacePath?: string;
}
