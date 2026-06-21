---
title: Content Model
description: How markdown and assets are organized.
order: 1
---

# Content Model

Reference content lives directly in `@lumra/reference-docs`. The docs app scans Markdown files from `src/content` so routes stay automatic without a separate content package.

## Categories

Documents are grouped by folder:

- `getting-started` for onboarding material.
- `guides` for workflow-oriented documentation.
- `reference` for stable technical details.

## Assets

Images live under `reference/docs/src/content/assets` and are served by the docs app from `/content-assets/*`.
