import { defineConfig } from '@playwright/test'

const port = 5173
const baseURL = `http://127.0.0.1:${port}`

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL,
    launchOptions: { executablePath: process.env.CHROME_BIN },
    reducedMotion: 'reduce',
  },
  webServer: {
    command: `npm run ${process.env.TEST_PREVIEW ? 'preview' : 'dev'} -- --host 127.0.0.1 --port ${port} --strictPort`,
    url: baseURL,
    reuseExistingServer: true,
  },
})
