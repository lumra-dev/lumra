"use client";

import { useChat } from "@ai-sdk/react";
import {
	PromptInput,
	PromptInputBody,
	PromptInputFooter,
	PromptInputSubmit,
	PromptInputTextarea,
} from "@lumra/webui/components/ai-elements/prompt-input";
import { Button } from "@lumra/webui/components/button";
import { Card } from "@lumra/webui/components/card";
import { cn } from "@lumra/webui/lib/utils";
import { WorkflowChatTransport } from "@workflow/ai";
import type { FileUIPart, UIMessage } from "ai";
import { XIcon } from "lucide-react";
import { useCallback, useMemo } from "react";
import { PromptAttachmentMenu } from "@/features/chat/components/actions/prompt-attachment-menu";
import { ConversationBody } from "@/features/chat/components/conversation-body";
import { t } from "@/features/i18n/lib/i18n";
import type { Workspace } from "@/features/workspaces/types/workspace";
import { WorkspaceInfo } from "./workspace-info";

const WORKFLOW_TRANSPORT_OPTIONS = {
	api: "/api/chat",
	initialStartIndex: -50,
	maxConsecutiveErrors: 5,
} satisfies ConstructorParameters<typeof WorkflowChatTransport<UIMessage>>[0];

const createTransport = () =>
	new WorkflowChatTransport<UIMessage>(WORKFLOW_TRANSPORT_OPTIONS);

export function WorkspacePanel({
	isActive,
	onActivate,
	onClose,
	workspace,
}: {
	isActive: boolean;
	onActivate: () => void;
	onClose: () => void;
	workspace: Workspace;
}) {
	const transport = useMemo(createTransport, []);
	const { error, messages, sendMessage, status, stop } = useChat({
		id: workspace.sessionId,
		transport,
	});
	const title = t(workspace.titleKey);

	const handleSubmit = useCallback(
		async ({ files, text }: { files: FileUIPart[]; text: string }) => {
			const trimmedText = text.trim();
			if (!(trimmedText || files.length)) {
				return;
			}
			await sendMessage({
				files,
				text: trimmedText,
			});
		},
		[sendMessage]
	);

	return (
		<Card
			className={cn(
				"flex h-full min-w-0 overflow-hidden rounded-lg border border-border py-0 shadow-none ring-inset",
				isActive && "border-ring ring-1 ring-ring"
			)}
			onClick={onActivate}
		>
			<div className="flex h-12 shrink-0 items-center justify-between border-border border-b px-3">
				<div className="flex min-w-0 items-center gap-2">
					<WorkspaceInfo workspace={workspace} />
					<div className="min-w-0">
						<p className="truncate font-medium text-sm">{title}</p>
					</div>
				</div>
				<div className="flex min-w-0 items-center">
					<Button
						aria-label={t("dashboard.workspace.close", { title })}
						onClick={(event) => {
							event.stopPropagation();
							onClose();
						}}
						size="icon-sm"
						variant="ghost"
					>
						<XIcon />
					</Button>
				</div>
			</div>

			<div className="flex min-h-0 flex-1 flex-col">
				<ConversationBody error={error} messages={messages} />
				<div className="shrink-0 border-border border-t p-2.5">
					<PromptInput accept="image/*,*/*" multiple onSubmit={handleSubmit}>
						<PromptInputBody>
							<PromptInputTextarea
								className="min-h-14"
								placeholder={t("dashboard.prompt.placeholder")}
							/>
						</PromptInputBody>
						<PromptInputFooter>
							<div className="flex min-w-0 items-center gap-2 text-muted-foreground text-xs">
								<PromptAttachmentMenu />
							</div>
							<PromptInputSubmit onStop={stop} status={status} />
						</PromptInputFooter>
					</PromptInput>
				</div>
			</div>
		</Card>
	);
}
