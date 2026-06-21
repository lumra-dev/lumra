"use client";

import { Button } from "@lumra/webui/components/button";
import { cn } from "@lumra/webui/lib/utils";
import { SaveIcon } from "lucide-react";
import { useActionState } from "react";
import { saveRuntimeConfigSource } from "../actions/runtime-config";
import type {
	RuntimeConfigEditorFile,
	RuntimeConfigEditorState,
} from "../types/runtime-config";
import { CodeEditor } from "./code-editor";

const initialState: RuntimeConfigEditorState = {
	message: "",
	ok: true,
};

interface RuntimeConfigEditorProps {
	files: RuntimeConfigEditorFile[];
}

export function RuntimeConfigEditor({ files }: RuntimeConfigEditorProps) {
	return (
		<div className="grid gap-5">
			{files.map((file) => (
				<RuntimeConfigEditorPanel file={file} key={file.file} />
			))}
		</div>
	);
}

function RuntimeConfigEditorPanel({ file }: { file: RuntimeConfigEditorFile }) {
	const [state, action, pending] = useActionState(
		saveRuntimeConfigSource,
		initialState
	);
	const messageClassName = getMessageClassName(state);

	return (
		<section className="grid gap-3 rounded-lg border bg-card p-4 shadow-sm">
			<div className="flex flex-wrap items-start justify-between gap-3">
				<div className="grid gap-1">
					<h2 className="font-medium text-base">{file.label}</h2>
					<p className="text-muted-foreground text-sm">{file.description}</p>
				</div>
				<Button
					disabled={pending}
					form={`${file.file}-runtime-config-form`}
					type="submit"
				>
					<SaveIcon />
					{pending ? "Saving" : "Save"}
				</Button>
			</div>
			<form
				action={action}
				className="grid gap-2"
				id={`${file.file}-runtime-config-form`}
			>
				<input name="file" type="hidden" value={file.file} />
				<CodeEditor defaultValue={file.content} name="source" />
				<p className={cn("min-h-5 text-sm", messageClassName)}>
					{state.message || "Ready"}
				</p>
			</form>
		</section>
	);
}

function getMessageClassName(state: RuntimeConfigEditorState) {
	if (!state.message) {
		return "text-transparent";
	}

	return state.ok ? "text-muted-foreground" : "text-destructive";
}
