import { existsSync, lstatSync, mkdirSync, rmSync, symlinkSync } from "node:fs";
import { join, resolve } from "node:path";
import { createSubpathFs, ReadWriteFs } from "ai-sdk-x";

/**
 * Create the local runtime adapter backed by the current process environment.
 */
export function createRuntimeAdapter() {
	const dataDir = join(process.cwd(), ".data");
	mkdirSync(dataDir, { recursive: true });

	const fs = new ReadWriteFs({
		root: dataDir,
	});

	return {
		ability: {
			browser: undefined,
			resolve({ path, sessionId }: { path?: string; sessionId: string }) {
				const workspacePath = `.lumra/sessions/${sessionId}/workspace`;
				const workspaceFs = path
					? createExternalWorkspaceFs(dataDir, workspacePath, path)
					: createSessionWorkspaceFs(fs, workspacePath);

				return workspaceFs;
			},
		},
		fs,
		name: "local",
	};
}

function createSessionWorkspaceFs(fs: ReadWriteFs, workspacePath: string) {
	return createSubpathFs(fs, workspacePath);
}

function createExternalWorkspaceFs(
	dataDir: string,
	workspacePath: string,
	targetPath: string
) {
	const target = resolve(targetPath);
	const linkPath = join(dataDir, workspacePath);

	mkdirSync(join(linkPath, ".."), { recursive: true });
	ensureWorkspaceSymlink(linkPath, target);

	return new ReadWriteFs({
		root: target,
	});
}

function ensureWorkspaceSymlink(linkPath: string, target: string): void {
	if (existsSync(linkPath)) {
		const stat = lstatSync(linkPath);

		if (stat.isSymbolicLink()) {
			return;
		}

		rmSync(linkPath, { force: true, recursive: true });
	}

	symlinkSync(target, linkPath, "dir");
}
