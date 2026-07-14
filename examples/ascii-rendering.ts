/**
 * ASCII rendering — turn Mermaid flowchart source into text diagrams.
 *
 * Run with: `pnpm tsx examples/ascii-rendering.ts`
 */
import { mermaidToAscii } from '../src/index';

const flow = `graph LR
  A[Client] --> B[API]
  B --> C[Database]`;

console.log('# Unicode (default)\n');
console.log(mermaidToAscii(flow));

console.log('\n# ASCII-only (asciiOnly: true)\n');
console.log(mermaidToAscii(flow, { asciiOnly: true }));

console.log('\n# Unsupported input falls back gracefully\n');
console.log(mermaidToAscii('pie title Pets\n  "Cats": 3'));
