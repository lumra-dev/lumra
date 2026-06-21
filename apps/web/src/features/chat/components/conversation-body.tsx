"use client";

import {
	Conversation,
	ConversationContent,
	ConversationEmptyState,
} from "@lumra/webui/components/ai-elements/conversation";
import {
	Message,
	MessageContent,
	MessageResponse,
} from "@lumra/webui/components/ai-elements/message";
import type { UIMessage } from "ai";
import { MessageSquareIcon } from "lucide-react";

import { t } from "@/features/i18n/lib/i18n";

export function ConversationBody({
	error,
	messages,
}: {
	error?: Error;
	messages: UIMessage[];
}) {
	if (messages.length === 0) {
		return (
			<Conversation className="min-h-0">
				<ConversationEmptyState
					description={error?.message}
					icon={<MessageSquareIcon />}
					title={t("dashboard.conversation.empty")}
				/>
			</Conversation>
		);
	}

	return (
		<Conversation className="min-h-0">
			<ConversationContent className="gap-6">
				{messages.map((message) => (
					<Message from={message.role} key={message.id}>
						<MessageContent>
							{message.parts.map((part, index) => {
								if (part.type !== "text") {
									return null;
								}
								return (
									<MessageResponse key={`${message.id}-${index}`}>
										{part.text}
									</MessageResponse>
								);
							})}
						</MessageContent>
					</Message>
				))}
				{error && <p className="text-destructive text-sm">{error.message}</p>}
			</ConversationContent>
		</Conversation>
	);
}
