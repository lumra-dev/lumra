"use client";

import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@lumra/webui/components/resizable";
import { useState } from "react";

import { TerminalPanel } from "@/features/bash/components/terminal-panel";
import { FilePanel } from "@/features/files/components/file-panel";

export function RightSidebarContent() {
	const [selectedPath, setSelectedPath] = useState("/apps/web/src/app");

	return (
		<div className="flex min-h-0 flex-1 flex-col">
			<div className="min-h-0 flex-1 p-3">
				<ResizablePanelGroup orientation="vertical">
					<ResizablePanel className="p-px" defaultSize="52%" minSize="220px">
						<FilePanel
							onSelectedPathChange={setSelectedPath}
							selectedPath={selectedPath}
						/>
					</ResizablePanel>
					<ResizableHandle
						className="h-5 w-full bg-transparent aria-[orientation=horizontal]:h-5 aria-[orientation=horizontal]:w-full"
						withHandle
					/>
					<ResizablePanel className="p-px" defaultSize="48%" minSize="240px">
						<TerminalPanel />
					</ResizablePanel>
				</ResizablePanelGroup>
			</div>
		</div>
	);
}
