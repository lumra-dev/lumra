# Packages

Shared libraries and utilities used across Lumra applications.

## Conventions

- Each package must extend `@lumra/config/tsconfig.base.json` in its own `tsconfig.json`
- Use the root catalog (`catalog:` protocol) for shared dependency versions
- Keep packages focused — one responsibility per package

## Packages

| Package | Responsibility |
|---|---|
| `@lumra/agent` | Durable AI agent using `@workflow/ai` and AI SDK providers |
| `@lumra/runtime` | `RuntimeAdapter` interface for runtime capabilities |
| `@lumra/provider` | AI provider abstraction (Anthropic, Gemini, OpenAI, OpenAI-compatible) via `ai` SDK |
| `@lumra/config` | Shared config base, JSONC parsing, and Zod validation schemas |
| `@lumra/env` | Environment variable validation via `@t3-oss/env-*` |
| `@lumra/i18n` | i18n with typed messages, interpolation, and compile-time shape assertion tests (en/zh/ja) |
| `@lumra/webui` | shadcn/ui-styled React components (Base UI + Tailwind v4 + CVA) including AI-specific elements |
| `@lumra/log` | Structured logging with `tslog` |
