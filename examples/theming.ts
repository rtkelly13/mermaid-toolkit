/**
 * Theming — generate Mermaid `themeVariables` config and inject theme directives.
 *
 * Run with: `pnpm tsx examples/theming.ts`
 */
import {
  applyThemeToMermaid,
  generateMermaidConfig,
  THEME_PRESETS,
  ThemeEngine,
} from '../src/index';

const diagram = 'graph TD\n  Start --> Stop';

// 1. Available presets.
console.log('# Presets\n');
console.log(Object.keys(THEME_PRESETS).join(', '));

// 2. One-shot: prepend a theme directive to a diagram using a preset.
console.log('\n# applyThemeToMermaid("retro-brutalist")\n');
console.log(applyThemeToMermaid(diagram, { preset: 'retro-brutalist' }));

// 3. The config object (e.g. to feed straight into mermaid.initialize).
console.log('\n# generateMermaidConfig("dark")\n');
console.log(JSON.stringify(generateMermaidConfig({ preset: 'dark' }), null, 2));

// 4. Fluent engine: start from a preset, override individual variables, then
//    emit ready-to-paste init code. This is the entry point a site would wire
//    to its own CSS variables (e.g. --diagram-primary) to keep diagrams on-brand.
console.log('\n# ThemeEngine — preset + custom overrides\n');
const engine = ThemeEngine.fromPreset('pastel');
engine.setThemeVariable('primaryColor', '#2563eb');
engine.setThemeVariable('lineColor', '#15803d');
console.log(engine.generateInitCode());
