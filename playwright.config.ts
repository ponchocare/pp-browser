import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  webServer: [
    {
      command: 'pnpm clean && pnpm exec tsc && pnpm exec wds',
      url: 'http://localhost:8000/',
    },
  ],
  use: {
    baseURL: 'http://localhost:8000/',
  },
  testDir: 'e2e/tests',
};

export default config;
