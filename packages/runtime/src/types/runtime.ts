import type { IFileSystem, KVStorage, X } from "ai-sdk-x";

/**
 * Runtime capabilities required by Lumra agents.
 */
export interface RuntimeAdapter {
	/**
	 * Optional browser runtime capability. The shape is intentionally deferred.
	 */
	browser?: unknown;
	/**
	 * Optional key-value cache for runtime-specific derived data.
	 */
	cache?: KVStorage;
	/**
	 * Human-readable runtime adapter name.
	 */
	name: string;
	/**
	 * File-system storage used for Lumra configuration files.
	 */
	storage: IFileSystem;
	/**
	 * AI SDK X execution environment for tools such as bash and patch.
	 */
	x: X;
}
