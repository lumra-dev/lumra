"use server";

import { getHub, type RuntimeConfigFile } from "@lumra/hub";
import { revalidatePath } from "next/cache";
import type { RuntimeConfigEditorState } from "../types/runtime-config";

const runtimeConfigFiles = new Set<RuntimeConfigFile>([
	"agent",
	"hub",
	"setting",
]);

const getField = (formData: FormData, name: string) => {
	const value = formData.get(name);

	return typeof value === "string" ? value : "";
};

/**
 * Persist a single Lumra runtime JSONC config file after Hub validation.
 */
export async function saveRuntimeConfigSource(
	_prevState: RuntimeConfigEditorState,
	formData: FormData
): Promise<RuntimeConfigEditorState> {
	const file = getField(formData, "file") as RuntimeConfigFile;
	const source = getField(formData, "source");

	if (!runtimeConfigFiles.has(file)) {
		return {
			message: "Unknown runtime config file.",
			ok: false,
		};
	}

	try {
		const hub = await getHub();
		await hub.saveRuntimeConfigSource(file, source);
		revalidatePath("/settings");

		return {
			message: `${file}.json saved.`,
			ok: true,
		};
	} catch (error) {
		return {
			message:
				error instanceof Error ? error.message : "Failed to save config.",
			ok: false,
		};
	}
}
