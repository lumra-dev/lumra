import "dotenv/config";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
	server: {
		CORS_ORIGIN: z.url().optional(),
		NODE_ENV: z
			.enum(["development", "production", "test"])
			.default("development"),
		PLATFORM: z.enum(["LOCAL", "VERCEL"]).default("LOCAL"),
	},
	runtimeEnv: process.env,
	emptyStringAsUndefined: true,
});
