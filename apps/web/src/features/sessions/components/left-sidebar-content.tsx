"use client";

import { Badge } from "@lumra/webui/components/badge";
import { Button } from "@lumra/webui/components/button";
import { Card, CardContent } from "@lumra/webui/components/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@lumra/webui/components/dropdown-menu";
import { Input } from "@lumra/webui/components/input";
import { ScrollArea } from "@lumra/webui/components/scroll-area";
import { Separator } from "@lumra/webui/components/separator";
import {
	BoxesIcon,
	InfoIcon,
	PlusIcon,
	RefreshCcwIcon,
	SearchIcon,
} from "lucide-react";
import { useState } from "react";

import { t } from "@/features/i18n/lib/i18n";
import { NAV_ITEMS, SESSIONS } from "@/features/sessions/data/sessions";
import type { Session } from "@/features/sessions/types/session";
import { SessionCard } from "./session-card";

export function LeftSidebarContent({
	onSessionOpen,
	selectedSessionId,
}: {
	onSessionOpen: (session: Session) => void;
	selectedSessionId: string;
}) {
	const [systemInfoOpen, setSystemInfoOpen] = useState(false);

	return (
		<div className="flex min-h-0 flex-1 flex-col">
			<div className="shrink-0 p-3">
				<div className="grid grid-cols-3 gap-2">
					{NAV_ITEMS.map(({ icon: Icon, labelKey }) => (
						<Card
							className="rounded-lg py-0 shadow-none transition-colors hover:bg-muted"
							key={labelKey}
						>
							<CardContent className="flex min-h-16 flex-col items-center justify-center gap-1 px-1.5 py-2.5 text-center">
								<Icon className="size-4 text-muted-foreground" />
								<span className="font-medium text-xs">{t(labelKey)}</span>
							</CardContent>
						</Card>
					))}
				</div>
			</div>

			<Separator />

			<div className="flex min-h-0 flex-1 flex-col gap-2 p-3">
				<div className="flex shrink-0 items-center gap-2">
					<div className="relative min-w-0 flex-1">
						<SearchIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							aria-label={t("dashboard.sessions.searchAria")}
							className="h-9 pl-9"
							placeholder={t("common.search")}
						/>
					</div>
					<Button
						aria-label={t("dashboard.sessions.add")}
						size="icon"
						variant="outline"
					>
						<PlusIcon />
					</Button>
					<Button
						aria-label={t("dashboard.sessions.refresh")}
						size="icon"
						variant="outline"
					>
						<RefreshCcwIcon />
					</Button>
				</div>

				<ScrollArea className="min-h-0 flex-1">
					<div className="flex flex-col gap-2 p-1 pr-2">
						{SESSIONS.map((session) => (
							<SessionCard
								isSelected={session.id === selectedSessionId}
								key={session.id}
								onOpen={() => onSessionOpen(session)}
								session={session}
							/>
						))}
					</div>
				</ScrollArea>
			</div>

			<Separator />

			<div className="shrink-0 p-3">
				<DropdownMenu>
					<DropdownMenuTrigger
						render={<Button className="w-full justify-start" variant="ghost" />}
					>
						<BoxesIcon data-icon="inline-start" />
						{t("dashboard.menu.title")}
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start" className="w-56 rounded-xl">
						<DropdownMenuGroup>
							<DropdownMenuLabel>Lumra</DropdownMenuLabel>
							<DropdownMenuSub
								onOpenChange={setSystemInfoOpen}
								open={systemInfoOpen}
							>
								<DropdownMenuSubTrigger
									onClick={(event) => {
										event.preventDefault();
										setSystemInfoOpen((open) => !open);
									}}
									openOnHover={false}
								>
									<InfoIcon data-icon="inline-start" />
									{t("dashboard.systemInfo.title")}
								</DropdownMenuSubTrigger>
								<DropdownMenuSubContent className="rounded-xl">
									<DropdownMenuGroup>
										<DropdownMenuLabel>
											{t("dashboard.systemInfo.runtime")}
										</DropdownMenuLabel>
										<DropdownMenuItem>
											{t("dashboard.systemInfo.version")}
											<Badge className="ml-auto" variant="outline">
												v0.1.0
											</Badge>
										</DropdownMenuItem>
										<DropdownMenuItem>
											{t("dashboard.systemInfo.status")}
											<Badge className="ml-auto" variant="outline">
												{t("dashboard.systemInfo.ready")}
											</Badge>
										</DropdownMenuItem>
										<DropdownMenuItem>
											{t("dashboard.systemInfo.transport")}
											<Badge className="ml-auto" variant="outline">
												stream
											</Badge>
										</DropdownMenuItem>
									</DropdownMenuGroup>
								</DropdownMenuSubContent>
							</DropdownMenuSub>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem>
								<RefreshCcwIcon />
								{t("dashboard.systemInfo.refreshStatus")}
							</DropdownMenuItem>
						</DropdownMenuGroup>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	);
}
