import { describe, expect, it } from 'vitest';
import {
  detectDiagramType,
  parseFlowchart,
  parseMermaid,
  parseSequenceDiagram,
} from '../src/parser';

describe('detectDiagramType', () => {
  it('detects graph flowcharts', () => {
    expect(detectDiagramType('graph LR\n A --> B')).toBe('flowchart');
  });

  it('detects flowchart keyword', () => {
    expect(detectDiagramType('flowchart TD\n A --> B')).toBe('flowchart');
  });

  it('detects sequence diagrams', () => {
    expect(detectDiagramType('sequenceDiagram\n A->>B: hi')).toBe('sequence');
  });

  it('ignores leading whitespace', () => {
    expect(detectDiagramType('   \n  graph LR\n A --> B')).toBe('flowchart');
  });

  it('returns null for unsupported types', () => {
    expect(detectDiagramType('pie title Pets')).toBeNull();
    expect(detectDiagramType('')).toBeNull();
  });
});

describe('parseFlowchart', () => {
  it('parses direction from the header', () => {
    expect(parseFlowchart('graph TD\n A --> B').direction).toBe('TD');
    expect(parseFlowchart('flowchart RL\n A --> B').direction).toBe('RL');
  });

  it('defaults to LR when no direction is given', () => {
    expect(parseFlowchart('graph\n A --> B').direction).toBe('LR');
  });

  it('collects nodes and a solid edge', () => {
    const diagram = parseFlowchart('graph LR\n A --> B');
    expect(diagram.nodes.map((n) => n.id).sort()).toEqual(['A', 'B']);
    expect(diagram.edges).toHaveLength(1);
    expect(diagram.edges[0]).toMatchObject({
      from: 'A',
      to: 'B',
      type: 'solid',
    });
  });

  it('captures node labels and edge labels', () => {
    const diagram = parseFlowchart('graph LR\n A[Start] -->|go| B[End]');
    const byId = Object.fromEntries(diagram.nodes.map((n) => [n.id, n.label]));
    expect(byId).toEqual({ A: 'Start', B: 'End' });
    expect(diagram.edges[0].label).toBe('go');
  });

  it('classifies dotted and thick edges', () => {
    expect(parseFlowchart('graph LR\n A -.- B').edges[0].type).toBe('dotted');
    expect(parseFlowchart('graph LR\n A ==> B').edges[0].type).toBe('thick');
  });

  it('falls back to the id when a node has no label', () => {
    const diagram = parseFlowchart('graph LR\n A --> B');
    expect(diagram.nodes.find((n) => n.id === 'A')?.label).toBe('A');
  });

  it('parses a standalone node declaration line', () => {
    const diagram = parseFlowchart('graph TD\n A[Only]');
    expect(diagram.nodes).toHaveLength(1);
    expect(diagram.nodes[0]).toMatchObject({ id: 'A', label: 'Only' });
    expect(diagram.edges).toHaveLength(0);
  });

  it('skips blank lines and %% comments', () => {
    const diagram = parseFlowchart('graph LR\n\n %% a comment\n A --> B');
    expect(diagram.nodes).toHaveLength(2);
    expect(diagram.edges).toHaveLength(1);
  });

  it('does not duplicate a node referenced twice', () => {
    const diagram = parseFlowchart('graph LR\n A --> B\n A --> C');
    expect(diagram.nodes.filter((n) => n.id === 'A')).toHaveLength(1);
    expect(diagram.edges).toHaveLength(2);
  });
});

describe('parseSequenceDiagram', () => {
  it('parses explicit participants with aliases', () => {
    const diagram = parseSequenceDiagram(
      'sequenceDiagram\n participant A as Alice\n A->>B: Hi',
    );
    const alice = diagram.participants.find((p) => p.id === 'A');
    expect(alice).toMatchObject({ id: 'A', label: 'Alice', alias: 'Alice' });
  });

  it('infers participants from messages', () => {
    const diagram = parseSequenceDiagram('sequenceDiagram\n A->>B: Hello');
    expect(diagram.participants.map((p) => p.id).sort()).toEqual(['A', 'B']);
    expect(diagram.messages[0]).toMatchObject({
      from: 'A',
      to: 'B',
      label: 'Hello',
      type: 'solid',
    });
  });

  it('classifies dotted messages', () => {
    const diagram = parseSequenceDiagram('sequenceDiagram\n A-->>B: reply');
    expect(diagram.messages[0].type).toBe('dotted');
  });

  it('skips blank lines and comments', () => {
    const diagram = parseSequenceDiagram(
      'sequenceDiagram\n\n %% note\n A->>B: Hi',
    );
    expect(diagram.messages).toHaveLength(1);
  });
});

describe('parseMermaid', () => {
  it('dispatches to the flowchart parser', () => {
    const diagram = parseMermaid('graph LR\n A --> B');
    expect(diagram?.type).toBe('flowchart');
  });

  it('dispatches to the sequence parser', () => {
    const diagram = parseMermaid('sequenceDiagram\n A->>B: Hi');
    expect(diagram?.type).toBe('sequence');
  });

  it('returns null for unsupported diagrams', () => {
    expect(parseMermaid('pie title Pets')).toBeNull();
  });
});
