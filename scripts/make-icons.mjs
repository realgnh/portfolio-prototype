// Regenerates the PNG icons from public/favicon.svg (run: node scripts/make-icons.mjs).
// Needs Playwright's Chromium, which the test setup already installs.
import { chromium } from '@playwright/test'
import { readFile } from 'node:fs/promises'

const svg = await readFile(new URL('../public/favicon.svg', import.meta.url), 'utf8')
const browser = await chromium.launch({ executablePath: process.env.CHROME_BIN })
const page = await browser.newPage()
for (const [name, size] of [['favicon-32.png', 32], ['apple-touch-icon.png', 180]]) {
  await page.setViewportSize({ width: size, height: size })
  await page.setContent(`<style>html,body{margin:0;background:transparent}svg{display:block;width:${size}px;height:${size}px}</style>${svg}`)
  await page.screenshot({ path: new URL(`../public/${name}`, import.meta.url).pathname, omitBackground: true })
}
await browser.close()
console.log('Icons written to public/')
