import type { NextRequest } from "next/server";
import { getRun } from "workflow/api";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ runId: string }> }
) {
	const { runId } = await params;
	const startIndex = Number(
		request.nextUrl.searchParams.get("startIndex") ?? 0
	);
	const run = getRun(runId);
	const readable = run.getReadable({ startIndex });
	const headers = new Headers({
		"Cache-Control": "no-cache",
		Connection: "keep-alive",
		"Content-Type": "text/event-stream",
	});

	if (startIndex < 0) {
		headers.set(
			"x-workflow-stream-tail-index",
			String(await readable.getTailIndex())
		);
	}

	return new Response(readable, { headers });
}
