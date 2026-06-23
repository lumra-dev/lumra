"use client";

import { FileTree } from "@lumra/webui/components/ai-elements/file-tree";
import { Button } from "@lumra/webui/components/button";
import { RefreshCcwIcon } from "lucide-react";

import { DEFAULT_EXPANDED_FILE_PATHS } from "@/features/files/data/file-tree";
import { t } from "@/features/i18n";
import { DirectoryTree } from "./directory-tree";

export function FilePanel({
	onSelectedPathChange,
	selectedPath,
}: {
	onSelectedPathChange: (path: string) => void;
	selectedPath: string;
}) {
	return (
		<div className="flex h-full flex-col overflow-hidden rounded-lg border bg-background">
			<div className="flex h-9 shrink-0 items-center justify-between border-b px-3 text-muted-foreground">
				<span className="font-medium text-xs">
					{t("dashboard.files.title")}
				</span>
				<Button
					aria-label={t("dashboard.files.refresh")}
					size="icon-sm"
					variant="ghost"
				>
					<RefreshCcwIcon />
				</Button>
			</div>
			<FileTree
				className="min-h-0 flex-1 overflow-x-auto rounded-none border-0 shadow-none [&>div]:min-w-max"
				defaultExpanded={DEFAULT_EXPANDED_FILE_PATHS}
				onSelect={onSelectedPathChange}
				selectedPath={selectedPath}
			>
				<DirectoryTree />
			</FileTree>
		</div>
	);
}
