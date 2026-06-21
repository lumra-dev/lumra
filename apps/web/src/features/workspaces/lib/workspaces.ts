import type { SidebarState } from "@/features/dashboard-shell/types/sidebar";
import type { Session } from "@/features/sessions/types/session";
import type { Workspace } from "@/features/workspaces/types/workspace";

export const WORKSPACE_WIDTH = 320;
export const MAX_LOADED_WORKSPACES = 4;
export const COMPACT_LAYOUT_WIDTH = 768;

export function createWorkspace(session?: Session): Workspace {
	return {
		descriptionKey:
			session?.descriptionKey ?? "dashboard.sessions.default.description",
		id: session?.id ?? "default",
		sessionId: session?.id ?? "default",
		titleKey: session?.titleKey ?? "dashboard.sessions.default.title",
	};
}

export function getWorkspaceLimit(width: number) {
	if (width < COMPACT_LAYOUT_WIDTH) {
		return 1;
	}

	return Math.max(
		1,
		Math.min(MAX_LOADED_WORKSPACES, Math.floor(width / WORKSPACE_WIDTH))
	);
}

export function togglePinned(state: SidebarState): SidebarState {
	return {
		...state,
		open: true,
		pinned: !state.pinned,
	};
}

export function toggleOpen(state: SidebarState): SidebarState {
	return {
		...state,
		open: !state.open,
	};
}

export function clearCloseTimer(
	timerRef: React.RefObject<ReturnType<typeof setTimeout> | null>
) {
	if (timerRef.current) {
		clearTimeout(timerRef.current);
		timerRef.current = null;
	}
}

export function openFloatingSidebar(
	setState: React.Dispatch<React.SetStateAction<SidebarState>>,
	timerRef: React.RefObject<ReturnType<typeof setTimeout> | null>
) {
	clearCloseTimer(timerRef);
	setState((current) =>
		current.pinned ? current : { ...current, open: true }
	);
}

export function scheduleFloatingSidebarClose(
	setState: React.Dispatch<React.SetStateAction<SidebarState>>,
	timerRef: React.RefObject<ReturnType<typeof setTimeout> | null>
) {
	clearCloseTimer(timerRef);
	timerRef.current = setTimeout(() => {
		setState((current) =>
			current.pinned ? current : { ...current, open: false }
		);
		timerRef.current = null;
	}, 160);
}
