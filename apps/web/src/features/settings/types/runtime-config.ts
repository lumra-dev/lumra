import type { RuntimeConfigFile } from "@lumra/hub";

export interface RuntimeConfigEditorFile {
	content: string;
	description: string;
	file: RuntimeConfigFile;
	label: string;
}

export type RuntimeConfigEditorState =
	| {
			message: string;
			ok: false;
	  }
	| {
			message: string;
			ok: true;
	  };
