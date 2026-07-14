# Examples

Runnable, dependency-free examples of the public API. They import from `../src`
directly (via `tsx`), so they always exercise the current source.

| File                  | Shows                                                        |
| --------------------- | ----------------------------------------------------------- |
| `ascii-rendering.ts`  | `mermaidToAscii` — unicode vs. ASCII output, graceful fallback |
| `theming.ts`          | presets, `applyThemeToMermaid`, `generateMermaidConfig`, `ThemeEngine` |
| `index.ts`            | runs all of the above (this is what `pnpm examples` runs)   |

## Run

```bash
pnpm examples                    # run everything
pnpm tsx examples/theming.ts     # run a single example
```

The `index.ts` aggregate is also invoked in CI as a lightweight smoke test —
if a public export is renamed or a signature breaks, the examples fail to run.
