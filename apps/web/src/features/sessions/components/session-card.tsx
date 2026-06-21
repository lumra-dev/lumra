"use client";

import { Badge } from "@lumra/webui/components/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@lumra/webui/components/card";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSeparator,
	ContextMenuTrigger,
} from "@lumra/webui/components/context-menu";
import { cn } from "@lumra/webui/lib/utils";
import { CopyIcon, ExternalLinkIcon, Trash2Icon } from "lucide-react";

import { t } from "@/features/i18n/lib/i18n";
import type { Session } from "@/features/sessions/types/session";

export function SessionCard({
	isSelected,
	onOpen,
	session,
}: {
	isSelected: boolean;
	onOpen: () => void;
	session: Session;
}) {
	return (
		<ContextMenu>
			<ContextMenuTrigger className="block rounded-2xl p-px">
				<Card
					className={cn(
						"cursor-pointer overflow-hidden rounded-2xl border border-border/35 py-0 shadow-none ring-inset transition-colors [--card-spacing:--spacing(2)] hover:bg-muted",
						isSelected && "border-ring bg-muted ring-1 ring-ring"
					)}
					onClick={onOpen}
				>
					<CardHeader className="gap-1 px-3.5 pt-3 pb-2">
						<CardTitle className="truncate text-sm">
							{t(session.titleKey)}
						</CardTitle>
						<CardDescription className="truncate text-xs">
							{t(session.descriptionKey)}
						</CardDescription>
					</CardHeader>
					<CardContent className="flex items-center gap-2 px-3.5 pb-3 font-light text-[10px] text-muted-foreground/70 leading-none">
						<span>{session.timestamp}</span>
						<span>{t(session.sourceKey)}</span>
						<Badge
							className="ml-auto h-auto border-transparent bg-transparent px-0 py-0 text-foreground shadow-none"
							variant="secondary"
						>
							{t(session.statusKey)}
						</Badge>
					</CardContent>
				</Card>
			</ContextMenuTrigger>
			<ContextMenuContent>
				<ContextMenuItem onClick={onOpen}>
					<ExternalLinkIcon />
					{t("dashboard.sessionActions.open")}
				</ContextMenuItem>
				<ContextMenuItem>
					<CopyIcon />
					{t("dashboard.sessionActions.clone")}
				</ContextMenuItem>
				<ContextMenuItem>
					<ExternalLinkIcon />
					{t("dashboard.sessionActions.copyLink")}
				</ContextMenuItem>
				<ContextMenuSeparator />
				<ContextMenuItem variant="destructive">
					<Trash2Icon />
					{t("dashboard.sessionActions.delete")}
				</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	);
}
