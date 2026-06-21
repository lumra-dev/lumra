import { getHub } from "@lumra/hub";
import type { RuntimeConfigEditorFile } from "../types/runtime-config";
import { runtimeConfigDescriptors } from "./runtime-config-files";

export async function getRuntimeConfigEditorFiles(): Promise<
	RuntimeConfigEditorFile[]
> {
	const hub = await getHub();

	return await Promise.all(
		runtimeConfigDescriptors.map(async (descriptor) => ({
			...descriptor,
			content: await hub.getRuntimeConfigSource(descriptor.file),
		}))
	);
}
