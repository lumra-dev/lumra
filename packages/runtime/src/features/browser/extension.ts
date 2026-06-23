import type { RuntimeExecutorExtension } from "../../executor";
import type { RuntimeFeature } from "..";
import { browserClickAction } from "./actions/click";
import { browserCloseAction } from "./actions/close";
import { browserEvaluateAction } from "./actions/evaluate";
import { browserGotoAction } from "./actions/goto";
import { browserLaunchAction } from "./actions/launch";
import { browserRunAction } from "./actions/run";
import { browserScreenshotAction } from "./actions/screenshot";
import { browserTypeAction } from "./actions/type";

export const browserExecutorExtension: RuntimeExecutorExtension = {
	actions: [
		browserLaunchAction,
		browserGotoAction,
		browserClickAction,
		browserTypeAction,
		browserEvaluateAction,
		browserScreenshotAction,
		browserRunAction,
		browserCloseAction,
	],
};

export const browserRuntimeFeature: RuntimeFeature = {
	executor: browserExecutorExtension,
	name: "browser",
};
