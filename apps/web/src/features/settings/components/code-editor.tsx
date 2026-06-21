"use client";

import { Textarea } from "@lumra/webui/components/textarea";
import type { ComponentProps } from "react";

type CodeEditorProps = ComponentProps<typeof Textarea>;

export function CodeEditor({ className, ...props }: CodeEditorProps) {
	return (
		<Textarea
			className={[
				"min-h-112 resize-y rounded-lg border bg-background font-mono text-xs leading-5",
				className,
			]
				.filter(Boolean)
				.join(" ")}
			spellCheck={false}
			{...props}
		/>
	);
}
