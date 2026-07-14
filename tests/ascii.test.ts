import { describe, expect, it } from 'vitest';
import {
  ASCII_CHARS,
  DEFAULT_OPTIONS,
  getBoxChars,
  UNICODE_CHARS,
} from '../src/constants';
import { mermaidToAscii } from '../src/index';

describe('getBoxChars', () => {
  it('returns unicode box characters by default', () => {
    expect(getBoxChars({})).toBe(UNICODE_CHARS);
    expect(getBoxChars({ asciiOnly: false })).toBe(UNICODE_CHARS);
  });

  it('returns ASCII-only characters when requested', () => {
    expect(getBoxChars({ asciiOnly: true })).toBe(ASCII_CHARS);
  });

  it('exposes sensible defaults', () => {
    expect(DEFAULT_OPTIONS.paddingX).toBe(5);
    expect(DEFAULT_OPTIONS.asciiOnly).toBe(false);
  });
});

describe('mermaidToAscii', () => {
  it('renders a horizontal flowchart containing the node labels', () => {
    const out = mermaidToAscii('graph LR\n A[Start] --> B[End]');
    expect(out).toContain('Start');
    expect(out).toContain('End');
    // Multi-line box art.
    expect(out.split('\n').length).toBeGreaterThan(1);
  });

  it('uses unicode box-drawing characters by default', () => {
    const out = mermaidToAscii('graph LR\n A --> B');
    expect(out).toMatch(/[┌┐└┘─│]/);
  });

  it('uses only ASCII characters when asciiOnly is set', () => {
    const out = mermaidToAscii('graph LR\n A --> B', { asciiOnly: true });
    expect(out).toMatch(/[+\-|]/);
    expect(out).not.toMatch(/[┌┐└┘─│►◄▲▼]/);
  });

  it('renders vertical (TD) flowcharts', () => {
    const out = mermaidToAscii('graph TD\n A --> B');
    expect(out).toContain('A');
    expect(out).toContain('B');
  });

  it('produces a stable golden rendering for a known diagram', () => {
    const out = mermaidToAscii('graph LR\n A[Start] --> B[Middle] --> C[End]', {
      asciiOnly: true,
    });
    expect(out).toMatchSnapshot();
  });

  it('returns a fallback block for unsupported diagram types', () => {
    const out = mermaidToAscii('pie title Pets\n "Cats": 3');
    expect(out).toContain('[ASCII RENDER ERROR]');
    expect(out).toContain('Unsupported diagram type');
    // The original source is echoed back for context.
    expect(out).toContain('pie title Pets');
  });

  it('reports that sequence rendering is not implemented yet', () => {
    const out = mermaidToAscii('sequenceDiagram\n A->>B: Hi');
    expect(out).toContain('Sequence diagram rendering not yet implemented');
  });
});
