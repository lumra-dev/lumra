"use client";

import { Button } from "@lumra/webui/components/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@lumra/webui/components/tooltip";
import { cn } from "@lumra/webui/lib/utils";
import { FolderIcon, PinIcon, PinOffIcon, XIcon } from "lucide-react";

import type {
	SidebarSide,
	SidebarState,
} from "@/features/dashboard-shell/types/sidebar";
import { t } from "@/features/i18n";
import { togglePinned } from "@/features/workspaces/lib/workspaces";
import { LumraWordmark } from "./wordmark";

export function DashboardSidebarShell({
	children,
	fullScreen = false,
	side,
	state,
	setState,
}: {
	children: React.ReactNode;
	fullScreen?: boolean;
	side: SidebarSide;
	state: SidebarState;
	setState: React.Dispatch<React.SetStateAction<SidebarState>>;
}) {
	let Icon = PinIcon;
	let label = t("dashboard.sidebar.pin", {
		side: t(`dashboard.sidebar.${side}`),
	});
	if (fullScreen) {
		Icon = XIcon;
		label = t("dashboard.sidebar.close", {
			side: t(`dashboard.sidebar.${side}`),
		});
	} else if (state.pinned) {
		Icon = PinOffIcon;
		label = t("dashboard.sidebar.unpin", {
			side: t(`dashboard.sidebar.${side}`),
		});
	}
	const handleAction = () => {
		if (fullScreen) {
			setState((current) => ({ ...current, open: false }));
			return;
		}

		setState((current) => togglePinned(current));
	};
	let radiusClass = "rounded-none";
	if (state.pinned || fullScreen) {
		radiusClass = "rounded-none";
	} else if (side === "left") {
		radiusClass = "rounded-r-xl";
	} else {
		radiusClass = "rounded-l-xl";
	}

	return (
		<aside
			className={cn(
				"flex h-full w-full min-w-0 flex-col overflow-hidden bg-card",
				state.pinned ? "border-0" : "border border-border",
				radiusClass,
				"shadow-sm"
			)}
		>
			<div className="flex h-14 shrink-0 items-center justify-between border-border border-b px-4">
				{side === "left" ? (
					<LumraWordmark />
				) : (
					<div className="flex min-w-0 items-center gap-3">
						<div className="flex size-9 shrink-0 items-center justify-center text-muted-foreground">
							<FolderIcon className="size-5" />
						</div>
						<div className="min-w-0">
							<p className="truncate font-medium text-base">
								{t("dashboard.workspace.title")}
							</p>
						</div>
					</div>
				)}
				<div className="flex items-center gap-1">
					<Tooltip>
						<TooltipTrigger
							render={
								<Button
									aria-label={label}
									onClick={handleAction}
									size="icon-sm"
									variant="ghost"
								/>
							}
						>
							<Icon />
						</TooltipTrigger>
						<TooltipContent>{label}</TooltipContent>
					</Tooltip>
				</div>
			</div>
			{children}
		</aside>
	);
}
