import type { X } from "ai-sdk-x";
import { createRuntimeX } from "../default-runtime";
import type { RuntimeXContext } from "../types/runtime";

export interface RuntimeToolContextOptions {
	sessionId: string;
	workspacePath?: string;
}

export interface RuntimeToolContext {
	getX(): Promise<X>;
	sessionId: string;
	workspacePath?: string;
}

let x: X | null = null;

export function createRuntimeToolContext(
	options: RuntimeToolContextOptions
): RuntimeToolContext {
	return {
		async getX() {
			if (x) {
				return x;
			}

			x = await createRuntimeX(toRuntimeContext(options));

			return x;
		},
		sessionId: options.sessionId,
		workspacePath: options.workspacePath,
	};
}

function toRuntimeContext(options: RuntimeToolContextOptions): RuntimeXContext {
	return {
		sessionId: options.sessionId,
		...(options.workspacePath ? { workspacePath: options.workspacePath } : {}),
	};
}
