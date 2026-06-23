import type { RuntimeAdapter, RuntimeXContext } from "../types/runtime";
import {
	GLOBAL_MEMORY_DIR,
	GLOBAL_SKILLS_DIR,
	LUMRA_DIR,
	SESSIONS_DIR,
} from "./constants";
import { sessionMemoryPath, sessionPath } from "./paths";

/**
 * Ensure the fixed Lumra runtime layout exists for a session.
 */
export async function ensureLumraLayout(
	runtimeAdapter: RuntimeAdapter,
	context: RuntimeXContext
): Promise<void> {
	const sessionDir = sessionPath(context.sessionId);
	const sessionMemoryDir = sessionMemoryPath(context.sessionId);
	const sessionMemoryLink = `${sessionDir}/memory`;

	await runtimeAdapter.fs.mkdir(LUMRA_DIR, { recursive: true });
	await runtimeAdapter.fs.mkdir(SESSIONS_DIR, { recursive: true });
	await runtimeAdapter.fs.mkdir(GLOBAL_MEMORY_DIR, { recursive: true });
	await runtimeAdapter.fs.mkdir(`${GLOBAL_MEMORY_DIR}/sessions`, {
		recursive: true,
	});
	await runtimeAdapter.fs.mkdir(GLOBAL_SKILLS_DIR, { recursive: true });
	await runtimeAdapter.fs.mkdir(sessionDir, { recursive: true });
	await runtimeAdapter.fs.mkdir(sessionMemoryDir, { recursive: true });
	await ensureSessionMemoryEntry(
		runtimeAdapter,
		sessionMemoryLink,
		sessionMemoryDir
	);
}

async function ensureSessionMemoryEntry(
	runtimeAdapter: RuntimeAdapter,
	linkPath: string,
	targetPath: string
): Promise<void> {
	if (await runtimeAdapter.fs.exists(linkPath)) {
		return;
	}

	try {
		await runtimeAdapter.fs.symlink(targetPath, linkPath);
	} catch {
		// Some runtime filesystems cannot represent symlinks; keep the fixed entry.
		await runtimeAdapter.fs.mkdir(linkPath, { recursive: true });
	}
}
