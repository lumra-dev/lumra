import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { ReadWriteFs, X } from "ai-sdk-x";

/**
 * Create the local runtime adapter backed by the current process environment.
 */
export function createRuntimeAdapter() {
	const dataDir = join(process.cwd(), ".data");
	mkdirSync(dataDir, { recursive: true });

	const storage = new ReadWriteFs({
		root: dataDir,
	});

	const x = X.init({
		bash: {
			cwd: process.cwd(),
		},
	});

	return {
		browser: undefined,
		name: "local",
		storage,
		x,
	};
}
