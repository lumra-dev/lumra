import type { IFileSystem } from "ai-sdk-x";
import type { RuntimeAdapter, RuntimeXContext } from "../types/runtime";

export type Awaitable<T> = Promise<T> | T;

export interface RuntimeExecutorAction<Input = unknown, Output = unknown> {
	description?: string;
	execute(input: Input, context: RuntimeExecutorContext): Awaitable<Output>;
	path: `${string}.${string}`;
}

export interface RuntimeExecutorContext extends RuntimeXContext {
	adapter: RuntimeAdapter;
	fs: IFileSystem;
	sessionMemoryFs: IFileSystem;
	skillsFs: IFileSystem;
	workspaceFs: IFileSystem;
}

export interface RuntimeExecutorExtension {
	actions?: RuntimeExecutorAction[];
	bootstrap?: string;
}
