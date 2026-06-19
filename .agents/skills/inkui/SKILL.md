---
name: inkui
description: copy-paste Ink components.
---

## CLI Reference

All commands use `npx @inkui-cli/inkui`.

```
# List all 32 available components with descriptions
npx @inkui-cli/inkui list

# Add one component
npx @inkui-cli/inkui add spinner

# Add multiple components at once
npx @inkui-cli/inkui add spinner table select dialog

# Add all 32 components at once
npx @inkui-cli/inkui add --all

# Interactive component browser — live preview every component
npx @inkui-cli/inkui playground

# Visual theme builder — pick colors interactively, exports inkui.theme.ts
npx @inkui-cli/inkui theme
```

Adding a component copies TypeScript source to `./components/ui/<component>/` in your project. A shared `_core.ts` (theme & design tokens) is copied once automatically.

Peer dependencies: `react ^19.0.0` + `ink ^6.0.0` + `node >=20`.

---

## All Components

### Phase 1 & 2 — Foundations

| Component | Install | Description |
|-----------|---------|-------------|
| **Spinner** | `npx @inkui-cli/inkui add spinner` | Animated spinner — `dots` `line` `arc` `bounce` |
| **Badge** | `npx @inkui-cli/inkui add badge` | Status chip — `default` `success` `warning` `error` `info` |
| **ProgressBar** | `npx @inkui-cli/inkui add progress-bar` | Fill bar with `%`, auto-sizes to terminal width |
| **TextInput** | `npx @inkui-cli/inkui add text-input` | Cursor, arrows, backspace, placeholder, password mask |
| **Select** | `npx @inkui-cli/inkui add select` | Arrow-key single-select, skips disabled items, generic `Select<T>` |
| **MultiSelect** | `npx @inkui-cli/inkui add multi-select` | Space-to-toggle checkboxes, pre-selection, generic `MultiSelect<T>` |
| **Table** | `npx @inkui-cli/inkui add table` | Auto column widths, overflow truncation, 5 border styles |
| **Dialog** | `npx @inkui-cli/inkui add dialog` | Modal — title, message, keyboard-navigable action buttons |
| **Toast** | `npx @inkui-cli/inkui add toast` | Auto-dismissing notifications — `success` `warning` `error` `info` |
| **StatusIndicator** | `npx @inkui-cli/inkui add status-indicator` | Animated dot + label for service/connection health |
| **LoadingBar** | `npx @inkui-cli/inkui add loading-bar` | Slim bar — indeterminate bounce or determinate `value` |
| **Confirm** | `npx @inkui-cli/inkui add confirm` | `y/N` prompt with default, resolves to static confirmation line |
| **KeyHint** | `npx @inkui-cli/inkui add key-hint` | Row of `[key] label` keyboard shortcut hints |
| **Divider** | `npx @inkui-cli/inkui add divider` | Full-width separator — `single` `double` `dashed` `bold`, optional title |
| **Header** | `npx @inkui-cli/inkui add header` | App header bar — `box` `line` `filled` styles, title + subtitle |
| **Panel** | `npx @inkui-cli/inkui add panel` | Bordered panel with optional title + `SplitPane` for split layouts |

### Phase 3A — Layout & Navigation

| Component | Install | Description |
|-----------|---------|-------------|
| **ScrollArea** | `npx @inkui-cli/inkui add scroll-area` | Scrollable region with visible scrollbar, keyboard nav (`↑↓ g G`) |
| **Tabs** | `npx @inkui-cli/inkui add tabs` | Tab panels — `underline` `boxed` `pills`, badge counts, disabled tabs |
| **Accordion** | `npx @inkui-cli/inkui add accordion` | Expand/collapse sections, single or multiple open, keyboard nav |

### Phase 3B — AI-Era Components

| Component | Install | Description |
|-----------|---------|-------------|
| **StreamingText** | `npx @inkui-cli/inkui add streaming-text` | Token-by-token LLM output with blinking cursor and `onComplete` |
| **TokenCounter** | `npx @inkui-cli/inkui add token-counter` | Token budget bar — green→yellow→red as usage climbs |
| **CodeBlock** | `npx @inkui-cli/inkui add code-block` | Syntax highlighting, line numbers, title, 13 languages — no external deps |
| **DiffView** | `npx @inkui-cli/inkui add diff-view` | Unified diff with LCS algorithm — add/remove highlighting, context lines |
| **Typewriter** | `npx @inkui-cli/inkui add typewriter` | Character-by-character animation — speed, delay, loop |

### Phase 3C — Data & Power

| Component | Install | Description |
|-----------|---------|-------------|
| **TreeView** | `npx @inkui-cli/inkui add tree-view` | Collapsible tree — vim keys, guide lines, expand/collapse state |
| **Autocomplete** | `npx @inkui-cli/inkui add autocomplete` | Live-filter input with dropdown, Tab-to-complete, Esc to clear |
| **Stepper** | `npx @inkui-cli/inkui add stepper` | Multi-step wizard progress — horizontal/vertical, completed/error states |
| **DataTable** | `npx @inkui-cli/inkui add data-table` | Sort, filter, paginate, select rows — keyboard driven |
| **Gauge** | `npx @inkui-cli/inkui add gauge` | Metric bar with color thresholds — bar/arc/ring variants |
| **Sparkline** | `npx @inkui-cli/inkui add sparkline` | Inline `▁▂▃▄▅▆▇█` mini chart — live time-series, auto-downsampling |
| **Markdown** | `npx @inkui-cli/inkui add markdown` | Terminal Markdown — headings, lists, bold/italic, code, blockquotes |
| **JSONViewer** | `npx @inkui-cli/inkui add json-viewer` | Interactive JSON explorer — expand/collapse, syntax colors, vim nav |

### Phase 3D — Hooks

| Component | Install | Description |
|-----------|---------|-------------|
| **useFocusManager** | `npx @inkui-cli/inkui add hooks` | Register/unregister focus regions, cycle with Tab |
| **useKeyBindings** | `npx @inkui-cli/inkui add hooks` | Declarative key binding map with priority and context |
| **useTerminalSize** | `npx @inkui-cli/inkui add hooks` | Live terminal `columns`/`rows` with resize tracking |
| **useAsync** | `npx @inkui-cli/inkui add hooks` | Async data fetching with `loading`/`data`/`error` state |

---

## Quick Usage

```tsx
import { render } from 'ink';
import { Spinner } from './components/ui/spinner';
import { Badge } from './components/ui/badge';
import { Table, type TableColumn } from './components/ui/table';

// Import theme from _core.ts (copied automatically on first add)
import { darkTheme } from './components/ui/_core';

type Pkg = { name: string; version: string };
const columns: TableColumn<Pkg>[] = [
  { key: 'name', header: 'Package', align: 'left' },
  { key: 'version', header: 'Version', align: 'right' },
];
const data: Pkg[] = [
  { name: 'express', version: '4.18.0' },
  { name: 'react', version: '19.0.0' },
];

function App() {
  return (
    <>
      <Badge variant="success">ready</Badge>
      <Spinner label="Loading..." type="dots" />
      <Table columns={columns} data={data} borderStyle="rounded" theme={darkTheme} />
    </>
  );
}

render(<App />);
```

---

## Theming

Components accept a `theme` prop of type `InkUITheme`. Built-in themes: `darkTheme`, `lightTheme` from `./components/ui/_core`. Use `npx @inkui-cli/inkui theme` for an interactive visual builder.

```tsx
import { darkTheme } from './components/ui/_core';
import type { InkUITheme } from './components/ui/_core';

const myTheme: InkUITheme = {
  colors: {
    primary: 'magenta',
    secondary: 'cyan',
    success: 'green',
    warning: 'yellow',
    error: 'red',
    info: 'blue',
    muted: 'gray',
    text: 'white',
    textInverse: 'black',
    border: 'gray',
    focus: 'magenta',
    selection: 'cyan',
  },
  border: 'rounded',
};
```

---

## Resources

- Docs: https://inkui-lib.vercel.app
- GitHub: https://github.com/kamlesh723/InkUI
- Each component has its own page on the docs site with full prop tables and live examples
