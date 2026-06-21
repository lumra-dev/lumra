"use client";

import { cn } from "@lumra/webui/lib/utils";
import { useEffect, useRef, useState } from "react";
import type {
	SidebarSide,
	SidebarState,
} from "@/features/dashboard-shell/types/sidebar";
import { t } from "@/features/i18n/lib/i18n";
import {
	clearCloseTimer,
	openFloatingSidebar,
	scheduleFloatingSidebarClose,
} from "@/features/workspaces/lib/workspaces";
import { DashboardSidebarShell } from "./sidebar-shell";

export function FloatingSidebar({
	children,
	closeTimerRef,
	fullScreen,
	side,
	state,
	setState,
}: {
	children: React.ReactNode;
	closeTimerRef: React.RefObject<ReturnType<typeof setTimeout> | null>;
	fullScreen: boolean;
	side: SidebarSide;
	state: SidebarState;
	setState: React.Dispatch<React.SetStateAction<SidebarState>>;
}) {
	const panelPosition = side === "left" ? "left-0" : "right-0";
	const closedTransform =
		side === "left" ? "-translate-x-full" : "translate-x-full";
	const [isPanelMounted, setIsPanelMounted] = useState(false);
	const railRef = useRef<HTMLButtonElement | null>(null);
	const panelRef = useRef<HTMLElement | null>(null);

	useEffect(() => {
		if (state.pinned) {
			setIsPanelMounted(false);
			return;
		}

		if (state.open) {
			setIsPanelMounted(true);
			return;
		}

		const timeout = window.setTimeout(() => setIsPanelMounted(false), 200);
		return () => window.clearTimeout(timeout);
	}, [state.open, state.pinned]);

	useEffect(() => {
		if (state.pinned || !state.open) {
			return;
		}

		const handlePointerMove = (event: PointerEvent) => {
			const target = event.target instanceof Node ? event.target : null;
			if (
				target &&
				(railRef.current?.contains(target) ||
					panelRef.current?.contains(target))
			) {
				clearCloseTimer(closeTimerRef);
				return;
			}
			scheduleFloatingSidebarClose(setState, closeTimerRef);
		};

		document.addEventListener("pointermove", handlePointerMove);
		return () => document.removeEventListener("pointermove", handlePointerMove);
	}, [closeTimerRef, setState, state.open, state.pinned]);

	if (state.pinned) {
		return null;
	}

	return (
		<div
			className={cn(
				"pointer-events-none absolute inset-y-0 z-40",
				panelPosition
			)}
		>
			<button
				aria-label={t("dashboard.sidebar.open", {
					side: t(`dashboard.sidebar.${side}`),
				})}
				className={cn(
					"pointer-events-auto absolute inset-y-0 w-4",
					panelPosition
				)}
				onMouseEnter={() => openFloatingSidebar(setState, closeTimerRef)}
				onMouseLeave={() =>
					scheduleFloatingSidebarClose(setState, closeTimerRef)
				}
				ref={railRef}
				tabIndex={-1}
				type="button"
			/>
			{isPanelMounted && (
				<aside
					aria-label={t("dashboard.sidebar.floating", {
						side: t(`dashboard.sidebar.${side}`),
					})}
					className={cn(
						"pointer-events-auto absolute shadow-xl transition-transform duration-200 ease-out",
						fullScreen
							? "inset-0 w-screen rounded-none"
							: "top-2 bottom-2 w-85 rounded-xl",
						panelPosition,
						state.open ? "translate-x-0" : closedTransform
					)}
					ref={panelRef}
				>
					<DashboardSidebarShell
						fullScreen={fullScreen}
						setState={setState}
						side={side}
						state={state}
					>
						{children}
					</DashboardSidebarShell>
				</aside>
			)}
		</div>
	);
}
