"use client";

import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@lumra/webui/components/resizable";
import { useCallback, useEffect, useRef, useState } from "react";

import { LeftSidebarContent } from "@/features/sessions/components/left-sidebar-content";
import { SESSIONS } from "@/features/sessions/data/sessions";
import type { Session } from "@/features/sessions/types/session";
import { RightSidebarContent } from "@/features/workspaces/components/right-sidebar-content";
import { WorkspaceArea } from "@/features/workspaces/components/workspace-area";
import {
	COMPACT_LAYOUT_WIDTH,
	createWorkspace,
	getWorkspaceLimit,
} from "@/features/workspaces/lib/workspaces";
import type { Workspace } from "@/features/workspaces/types/workspace";
import type { SidebarState } from "../types/sidebar";
import { FloatingSidebar } from "./floating-sidebar";
import { DashboardSidebarShell } from "./sidebar-shell";

export function DashboardClient() {
	const [leftSidebar, setLeftSidebar] = useState<SidebarState>({
		pinned: false,
		open: false,
	});
	const [rightSidebar, setRightSidebar] = useState<SidebarState>({
		pinned: false,
		open: false,
	});
	const leftCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const rightCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const [selectedSessionId, setSelectedSessionId] = useState(
		SESSIONS[0]?.id ?? ""
	);
	const [workspaces, setWorkspaces] = useState<Workspace[]>(() => [
		createWorkspace(SESSIONS[0]),
	]);
	const [activeWorkspaceId, setActiveWorkspaceId] = useState(
		SESSIONS[0]?.id ?? ""
	);
	const [workspaceLimit, setWorkspaceLimit] = useState(1);
	const [isCompactLayout, setIsCompactLayout] = useState(false);
	const workspaceAreaRef = useRef<HTMLDivElement | null>(null);

	const activeWorkspace = workspaces.find(
		(workspace) => workspace.id === activeWorkspaceId
	);

	useEffect(() => {
		const area = workspaceAreaRef.current;
		if (!area) {
			return;
		}

		const updateWorkspaceLimit = (width: number) => {
			setWorkspaceLimit(getWorkspaceLimit(width));
		};

		updateWorkspaceLimit(area.getBoundingClientRect().width);
		const resizeObserver = new ResizeObserver((entries) => {
			const entry = entries[0];
			if (entry) {
				updateWorkspaceLimit(entry.contentRect.width);
			}
		});

		resizeObserver.observe(area);
		return () => resizeObserver.disconnect();
	}, []);

	useEffect(() => {
		const mediaQuery = window.matchMedia(
			`(max-width: ${COMPACT_LAYOUT_WIDTH - 1}px)`
		);
		const updateCompactLayout = () => {
			setIsCompactLayout(mediaQuery.matches);
		};

		updateCompactLayout();
		mediaQuery.addEventListener("change", updateCompactLayout);
		return () => mediaQuery.removeEventListener("change", updateCompactLayout);
	}, []);

	useEffect(() => {
		if (!isCompactLayout) {
			return;
		}

		setLeftSidebar((current) => ({ ...current, pinned: false }));
		setRightSidebar((current) => ({ ...current, pinned: false }));
	}, [isCompactLayout]);

	useEffect(() => {
		setWorkspaces((current) => {
			if (current.length <= workspaceLimit) {
				return current;
			}

			const activeIndex = current.findIndex(
				(workspace) => workspace.id === activeWorkspaceId
			);
			const preferred = activeIndex >= 0 ? current[activeIndex] : current[0];
			const next = [
				preferred,
				...current.filter((workspace) => workspace.id !== preferred?.id),
			].slice(0, workspaceLimit);
			setActiveWorkspaceId(next[0]?.id ?? "");
			setSelectedSessionId(next[0]?.sessionId ?? "");
			return next;
		});
	}, [activeWorkspaceId, workspaceLimit]);

	const handleSessionOpen = useCallback(
		(session: Session) => {
			setSelectedSessionId(session.id);
			setActiveWorkspaceId(session.id);
			setWorkspaces((current) => {
				if (current.some((workspace) => workspace.id === session.id)) {
					return current;
				}

				const nextWorkspace = createWorkspace(session);
				if (current.length < workspaceLimit) {
					return [...current, nextWorkspace];
				}

				const activeIndex = current.findIndex(
					(workspace) => workspace.id === activeWorkspaceId
				);
				const replaceIndex =
					activeIndex >= 0 ? activeIndex : current.length - 1;
				return current.map((workspace, index) =>
					index === replaceIndex ? nextWorkspace : workspace
				);
			});
		},
		[activeWorkspaceId, workspaceLimit]
	);

	const handleWorkspaceClose = useCallback((workspaceId: string) => {
		setWorkspaces((current) => {
			const next = current.filter((workspace) => workspace.id !== workspaceId);
			if (next.length === 0) {
				setActiveWorkspaceId("");
				return [];
			}
			setActiveWorkspaceId((activeId) =>
				activeId === workspaceId ? (next[0]?.id ?? "") : activeId
			);
			return next;
		});
	}, []);

	const handleWorkspacesCloseAll = useCallback(() => {
		setWorkspaces([]);
		setActiveWorkspaceId("");
		setSelectedSessionId("");
	}, []);

	return (
		<main className="h-dvh overflow-hidden bg-background text-foreground">
			<div className="relative size-full">
				<ResizablePanelGroup orientation="horizontal">
					{!isCompactLayout && leftSidebar.pinned && leftSidebar.open && (
						<>
							<ResizablePanel
								className="min-w-70 p-px"
								defaultSize="22%"
								maxSize="34%"
								minSize="280px"
							>
								<DashboardSidebarShell
									setState={setLeftSidebar}
									side="left"
									state={leftSidebar}
								>
									<LeftSidebarContent
										onSessionOpen={handleSessionOpen}
										selectedSessionId={selectedSessionId}
									/>
								</DashboardSidebarShell>
							</ResizablePanel>
							<ResizableHandle withHandle />
						</>
					)}
					<ResizablePanel
						className="min-w-90 p-px"
						defaultSize="54%"
						minSize="360px"
					>
						<div className="size-full" ref={workspaceAreaRef}>
							<WorkspaceArea
								activeWorkspace={activeWorkspace}
								leftSidebar={leftSidebar}
								onActiveWorkspaceChange={setActiveWorkspaceId}
								onLeftSidebarChange={setLeftSidebar}
								onRightSidebarChange={setRightSidebar}
								onWorkspaceClose={handleWorkspaceClose}
								onWorkspacesCloseAll={handleWorkspacesCloseAll}
								rightSidebar={rightSidebar}
								workspaceLimit={workspaceLimit}
								workspaces={workspaces}
							/>
						</div>
					</ResizablePanel>
					{!isCompactLayout && rightSidebar.pinned && rightSidebar.open && (
						<>
							<ResizableHandle withHandle />
							<ResizablePanel
								className="min-w-70 p-px"
								defaultSize="24%"
								maxSize="36%"
								minSize="280px"
							>
								<DashboardSidebarShell
									setState={setRightSidebar}
									side="right"
									state={rightSidebar}
								>
									<RightSidebarContent />
								</DashboardSidebarShell>
							</ResizablePanel>
						</>
					)}
				</ResizablePanelGroup>

				<FloatingSidebar
					closeTimerRef={leftCloseTimerRef}
					fullScreen={isCompactLayout}
					setState={setLeftSidebar}
					side="left"
					state={leftSidebar}
				>
					<LeftSidebarContent
						onSessionOpen={handleSessionOpen}
						selectedSessionId={selectedSessionId}
					/>
				</FloatingSidebar>
				<FloatingSidebar
					closeTimerRef={rightCloseTimerRef}
					fullScreen={isCompactLayout}
					setState={setRightSidebar}
					side="right"
					state={rightSidebar}
				>
					<RightSidebarContent />
				</FloatingSidebar>
			</div>
		</main>
	);
}
