import { randomUUID } from "node:crypto";
import z from "zod";

import { env } from "../shared/env";

const createTimestamp = () => new Date().toISOString();
const createNodeName = () => `lumra-${randomUUID().slice(0, 8)}`;

export const publicEndpointSchema = z.object({
	url: env().optional(),
	port: z.number().int().min(1).max(65_535).optional(),
});

export const nodeMonitorSchema = z.object({
	heartbeatMs: z.number().int().positive().default(30_000),
	timeoutMs: z.number().int().positive().default(90_000),
	lastSeen: z.iso.datetime().optional(),
});

const defaultNodeMonitor = {
	heartbeatMs: 30_000,
	timeoutMs: 90_000,
};

export const agentNodeSchema = z.object({
	name: z.string().default(createNodeName),
	isOnline: z.boolean().default(false),
	isPublic: z.boolean().default(false),
	public: publicEndpointSchema.optional(),
	monitor: nodeMonitorSchema.default(defaultNodeMonitor),
});

export const hubSchema = agentNodeSchema.extend({
	isHub: z.boolean().default(false),
	public: publicEndpointSchema.optional(),
	agents: z.array(agentNodeSchema).default([]),
	updated: z.iso.datetime().default(createTimestamp),
	created: z.iso.datetime().default(createTimestamp),
});
export default hubSchema;
export type HubSchema = z.infer<typeof hubSchema>;
