"use client";

import { Button } from "@lumra/webui/components/button";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@lumra/webui/components/resizable";
import {
	PanelLeftCloseIcon,
	PanelLeftOpenIcon,
	PanelRightCloseIcon,
	PanelRightOpenIcon,
	XIcon,
} from "lucide-react";

import type { SidebarState } from "@/features/dashboard-shell/types/sidebar";
import { t } from "@/features/i18n/lib/i18n";
import { toggleOpen } from "@/features/workspaces/lib/workspaces";
import type { Workspace } from "@/features/workspaces/types/workspace";
import { WorkspacePanel } from "./workspace-panel";

export function WorkspaceArea({
	activeWorkspace,
	leftSidebar,
	onActiveWorkspaceChange,
	onLeftSidebarChange,
	onRightSidebarChange,
	onWorkspacesCloseAll,
	onWorkspaceClose,
	rightSidebar,
	workspaceLimit,
	workspaces,
}: {
	activeWorkspace?: Workspace;
	leftSidebar: SidebarState;
	onActiveWorkspaceChange: (workspaceId: string) => void;
	onLeftSidebarChange: React.Dispatch<React.SetStateAction<SidebarState>>;
	onRightSidebarChange: React.Dispatch<React.SetStateAction<SidebarState>>;
	onWorkspacesCloseAll: () => void;
	onWorkspaceClose: (workspaceId: string) => void;
	rightSidebar: SidebarState;
	workspaceLimit: number;
	workspaces: Workspace[];
}) {
	return (
		<section className="flex h-full min-w-0 flex-col bg-background">
			<header className="flex h-11 shrink-0 items-center gap-2 border-border border-b px-3">
				<Button
					aria-label={t("dashboard.sidebar.toggleLeft")}
					onClick={() => onLeftSidebarChange((current) => toggleOpen(current))}
					size="icon-sm"
					variant="ghost"
				>
					{leftSidebar.open || leftSidebar.pinned ? (
						<PanelLeftCloseIcon />
					) : (
						<PanelLeftOpenIcon />
					)}
				</Button>
				<div className="flex min-w-0 flex-1 items-center justify-center gap-2">
					<p className="min-w-0 max-w-72 truncate text-center font-medium text-xs">
						{activeWorkspace
							? t(activeWorkspace.titleKey)
							: t("dashboard.workspace.selectSession")}
					</p>
					<Button
						aria-label={t("dashboard.workspace.closeLoaded")}
						className="group h-6 gap-1 rounded-full px-2.5 text-[11px]"
						disabled={workspaces.length === 0}
						onClick={onWorkspacesCloseAll}
						variant="outline"
					>
						<span className="group-hover:hidden">{workspaces.length}</span>
						<span className="hidden group-hover:inline-flex">
							<XIcon className="size-3.5" />
						</span>
						<span className="text-muted-foreground/70">/ {workspaceLimit}</span>
					</Button>
				</div>
				<Button
					aria-label={t("dashboard.sidebar.toggleRight")}
					onClick={() => onRightSidebarChange((current) => toggleOpen(current))}
					size="icon-sm"
					variant="ghost"
				>
					{rightSidebar.open || rightSidebar.pinned ? (
						<PanelRightCloseIcon />
					) : (
						<PanelRightOpenIcon />
					)}
				</Button>
			</header>

			<div className="min-h-0 flex-1 p-1">
				{workspaces.length > 0 ? (
					<ResizablePanelGroup orientation="horizontal">
						{workspaces.map((workspace, index) => (
							<WorkspacePanelSlot
								isActive={workspace.id === activeWorkspace?.id}
								isLast={index === workspaces.length - 1}
								key={workspace.id}
								onActiveWorkspaceChange={onActiveWorkspaceChange}
								onWorkspaceClose={onWorkspaceClose}
								workspace={workspace}
								workspaceCount={workspaces.length}
							/>
						))}
					</ResizablePanelGroup>
				) : (
					<div className="flex size-full items-center justify-center rounded-xl border bg-card text-muted-foreground">
						{t("dashboard.workspace.empty")}
					</div>
				)}
			</div>
		</section>
	);
}

function WorkspacePanelSlot({
	isActive,
	isLast,
	onActiveWorkspaceChange,
	onWorkspaceClose,
	workspace,
	workspaceCount,
}: {
	isActive: boolean;
	isLast: boolean;
	onActiveWorkspaceChange: (workspaceId: string) => void;
	onWorkspaceClose: (workspaceId: string) => void;
	workspace: Workspace;
	workspaceCount: number;
}) {
	return (
		<>
			<ResizablePanel
				className="min-w-65 overflow-visible px-0.5 py-px"
				defaultSize={`${100 / workspaceCount}%`}
				minSize="260px"
			>
				<WorkspacePanel
					isActive={isActive}
					onActivate={() => onActiveWorkspaceChange(workspace.id)}
					onClose={() => onWorkspaceClose(workspace.id)}
					workspace={workspace}
				/>
			</ResizablePanel>
			{!isLast && <ResizableHandle className="bg-transparent" withHandle />}
		</>
	);
}
