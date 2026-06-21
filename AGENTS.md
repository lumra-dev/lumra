# Lumra

## Commands

| Command | What it runs |
|---|---|
| `bun install` | install dependencies |
| `bun run dev` | `turbo dev` — all apps in dev mode |
| `bun run dev:web` | `turbo -F web dev` — web app only |
| `bun run build` | `turbo build` — full build |
| `bun run check` | `ultracite check` — lint + format check (root) |
| `bun run fix` | `ultracite fix` — lint + format fix (root) |
| `bun run check-types` | `turbo check-types` — type-check all packages |
| `bun test` | run tests with `bun:test` |
| `bun x ultracite check` | lint a specific package |

CI order: `bun run check` → `bun run check-types` → `bun run build`. Run in that order before committing.

## Structure

- **Package manager**: Bun (v1.3.14). Never use npm/pnpm/yarn.
- **Monorepo tool**: Turborepo (v2.9+).
- **Lint/format**: Ultracite (extends Biome with Next.js rules). Tab indent, double quotes, `source.organizeImports` and `source.fixAll.biome` run on save.
- **TypeScript**: `^6` with `strict`, `verbatimModuleSyntax`, `noUnusedLocals`, `noUnusedParameters`, `noUncheckedIndexedAccess`. Use `type` keyword for type-only imports.
- **React Compiler** enabled in both Next.js apps.
- **Package catalog** in root `package.json` pins shared deps (`react@19.2.6`, `next@16.2.0`, `tailwindcss@4`, `ai@7.0.0-canary.176`, etc.).
- **Reused config**: `@lumra/config/tsconfig.base.json`.

## Apps

- **`apps/web`** (`@lumra/web`): Next.js 16, React 19, Tailwind v4, shadcn/ui via `@lumra/webui`. Entry: `src/app/layout.tsx`.
- **`apps/cli`** (`@lumra/cli`): Pastel (Ink-based CLI framework). Entry: `source/cli.ts` → Pastel auto-discovers commands in `source/commands/`.

## Packages

| Package | Purpose |
|---|---|
| `@lumra/agent` | Durable AI agent using `@workflow/ai` and AI SDK providers |
| `@lumra/runtime` | `RuntimeAdapter` interface |
| `@lumra/runtime-local` | Runtime adapter — local (stub) |
| `@lumra/runtime-vercel` | Runtime adapter — Vercel (stub) |
| `@lumra/provider` | AI provider abstraction via `ai` SDK (stub) |
| `@lumra/bot` | Chat bot using `chat` npm package + filesystem state |
| `@lumra/tool-*` | AI tool implementations (bash, browser, view, chat, patch, tasks) |
| `@lumra/webui` | shadcn/ui components (Base UI React + Tailwind v4 + CVA) |
| `@lumra/tui` | Ink-based terminal UI components |
| `@lumra/env` | Env validation |
| `@lumra/config` | Shared config base + JSONC parsing |
| `@lumra/i18n` | i18n with compile-time shape assertion tests for locale JSON |
| `@lumra/hub`, `@lumra/acp`, `@lumra/secure`, `@lumra/otel`, `@lumra/log` | Stubs |

## Build quirks

- Most packages run `tsc --noEmit` as their `build` script (type-check only, no JS output).
- `apps/cli` has `"build": ""` — the Pastel CLI doesn't need a build step for development.

## Testing

- Uses **`bun:test`** (Bun's built-in test runner). Run with `bun test`.

## Style conventions

- **No comments** in source code unless essential.
- `cn()` utility (clsx + tailwind-merge) for className merging.
- CVA for UI component variants.
- Tailwind v4 syntax (`@import "tailwindcss"`, `@source`, `@theme`, `@custom-variant`).
- Biome on save auto-fixes and organizes imports.
