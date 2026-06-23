"use client";

import {
	Terminal,
	TerminalContent,
	TerminalCopyButton,
	TerminalHeader,
	TerminalTitle,
} from "@lumra/webui/components/ai-elements/terminal";

import { TERMINAL_OUTPUT_LINES } from "@/features/bash/data/terminal";
import { t } from "@/features/i18n";

export function TerminalPanel() {
	const output = TERMINAL_OUTPUT_LINES.map((line) =>
		line.startsWith("dashboard.") ? t(line) : line
	).join("\n");

	return (
		<div className="flex h-full flex-col">
			<Terminal className="min-h-0 flex-1" output={output}>
				<TerminalHeader className="px-3 py-1">
					<TerminalTitle className="text-xs" />
					<TerminalCopyButton className="size-7" />
				</TerminalHeader>
				<TerminalContent />
			</Terminal>
		</div>
	);
}
