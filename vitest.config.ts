import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Only unit/integration specs — benchmarks run via `vitest bench`.
    include: ['tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      // Cover the shipped library only; scripts/bench/examples are tooling.
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.d.ts'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80,
      },
    },
  },
});
