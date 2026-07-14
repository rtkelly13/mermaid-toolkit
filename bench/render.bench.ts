import { bench, describe } from 'vitest';
import { mermaidToAscii } from '../src/index';
import { parseMermaid } from '../src/parser';
import { ThemeEngine } from '../src/theme-engine';

/** Build a linear flowchart of `n` nodes: A0 --> A1 --> ... */
function linearFlowchart(n: number): string {
  const lines = ['graph LR'];
  for (let i = 0; i < n - 1; i++) {
    lines.push(`  A${i}[Node ${i}] --> A${i + 1}[Node ${i + 1}]`);
  }
  return lines.join('\n');
}

const SMALL = linearFlowchart(3);
const MEDIUM = linearFlowchart(20);
const LARGE = linearFlowchart(100);

describe('parseMermaid', () => {
  bench('small (3 nodes)', () => {
    parseMermaid(SMALL);
  });
  bench('medium (20 nodes)', () => {
    parseMermaid(MEDIUM);
  });
  bench('large (100 nodes)', () => {
    parseMermaid(LARGE);
  });
});

describe('mermaidToAscii (parse + layout + render)', () => {
  bench('small (3 nodes)', () => {
    mermaidToAscii(SMALL);
  });
  bench('medium (20 nodes)', () => {
    mermaidToAscii(MEDIUM);
  });
  bench('large (100 nodes)', () => {
    mermaidToAscii(LARGE);
  });
});

describe('ThemeEngine', () => {
  bench('generate init code from preset', () => {
    ThemeEngine.fromPreset('retro-brutalist').generateInitCode();
  });
  bench('apply theme directive to diagram', () => {
    ThemeEngine.fromPreset('dark').applyTheme(MEDIUM);
  });
});
