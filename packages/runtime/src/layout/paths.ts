import { GLOBAL_MEMORY_DIR, SESSIONS_DIR } from "./constants";

export function sessionPath(sessionId: string): string {
	return `${SESSIONS_DIR}/${sessionId}`;
}

export function sessionMemoryPath(sessionId: string): string {
	return `${GLOBAL_MEMORY_DIR}/sessions/${sessionId}`;
}
