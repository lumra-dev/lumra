---
title: Installation
description: Set up the reference workspace with Bun and Turbo.
order: 1
---

# Installation

Lumra uses Bun workspaces and Turborepo to keep packages isolated while sharing a single dependency graph.

## Prerequisites

- Bun 1.3 or newer.
- Node-compatible shell environment.
- Access to the Lumra repository workspace.

## Commands

```bash
bun install
bun turbo run build --filter @lumra/reference-docs
```

Use filtered Turbo commands when working on a single app. This keeps feedback fast without bypassing package boundaries.
