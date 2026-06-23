// biome-ignore-all lint/performance/noBarrelFile: Package entrypoint intentionally re-exports the public runtime API.
import type {
	RuntimeExecutorContext as RuntimeExecutorContextInternal,
	RuntimeExecutorExtension as RuntimeExecutorExtensionInternal,
} from "./executor";
import { createRuntimeExecutor as createRuntimeExecutorInternal } from "./executor";

export {
	createRuntimeX,
	getRuntime,
	type RuntimePlatform,
	runtime,
} from "./default-runtime";
export type {
	RuntimeFeature,
	RuntimeFeatureContext,
} from "./features";
export type {
	BrowserClickInput,
	BrowserClickOutput,
} from "./features/browser/actions/click";
export type {
	BrowserCloseInput,
	BrowserCloseOutput,
} from "./features/browser/actions/close";
export type {
	BrowserEvaluateInput,
	BrowserEvaluateOutput,
} from "./features/browser/actions/evaluate";
export type {
	BrowserGotoInput,
	BrowserGotoOutput,
} from "./features/browser/actions/goto";
export type {
	BrowserLaunchInput,
	BrowserLaunchOutput,
} from "./features/browser/actions/launch";
export type {
	BrowserRunInput,
	BrowserRunOutput,
} from "./features/browser/actions/run";
export type {
	BrowserScreenshotInput,
	BrowserScreenshotOutput,
} from "./features/browser/actions/screenshot";
export type {
	BrowserTypeInput,
	BrowserTypeOutput,
} from "./features/browser/actions/type";
export {
	browserExecutorExtension,
	browserRuntimeFeature,
} from "./features/browser/extension";
export { closeBrowserRuntime } from "./features/browser/state";
export {
	createRuntimeToolContext,
	type RuntimeToolContext,
	type RuntimeToolContextOptions,
} from "./toolkit";
export type {
	RuntimeAbility,
	RuntimeAdapter,
	RuntimeWorkspaceInput,
	RuntimeXContext,
} from "./types/runtime";

export function createRuntimeExecutor(
	context: RuntimeExecutorContextInternal,
	extensions: RuntimeExecutorExtensionInternal[] = []
) {
	return createRuntimeExecutorInternal(context, extensions);
}
