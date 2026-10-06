import { defineConfig } from 'vitest/config';

export default defineConfig({
  // Relative asset paths so the build works inside itch.io's nested iframe.
  base: './',
  build: { target: 'es2022', assetsInlineLimit: 0 },
  test: {
    include: ['tests/unit/**/*.test.ts'],
  },
});
