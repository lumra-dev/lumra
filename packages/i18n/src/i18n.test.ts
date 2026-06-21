/**
 * Compile-time structural shape assertions for locale message files.
 *
 * Verifies that `ja.json` and `zh.json` have the exact same nested key
 * structure as the default `en.json`. A mismatch (missing or extra keys at
 * any depth) causes a TypeScript compilation error.
 *
 */

import type en from "../messages/en.json";
import type ja from "../messages/ja.json";
import type zh from "../messages/zh.json";

type ShapeOf<T> = T extends string ? string : { [K in keyof T]: ShapeOf<T[K]> };

export const _assert_ja: ShapeOf<typeof ja> extends ShapeOf<typeof en>
	? ShapeOf<typeof en> extends ShapeOf<typeof ja>
		? true
		: false
	: false = true;

export const _assert_zh: ShapeOf<typeof zh> extends ShapeOf<typeof en>
	? ShapeOf<typeof en> extends ShapeOf<typeof zh>
		? true
		: false
	: false = true;
