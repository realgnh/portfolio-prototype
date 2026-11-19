import { expect, test } from '@playwright/test'
import { join } from 'node:path'
import { projects } from '../src/data/projects'
import { profileLinks, site, ui } from '../src/data/site'

test('keyboard navigation, active sections and metadata follow the route', async ({ page }) => {
  await page.goto('/')
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: ui.skip })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('main')).toBeFocused()

  const nav = page.getByRole('navigation', { name: ui.navigation })
  await expect(nav.getByRole('link', { name: 'Work' })).toHaveAttribute('aria-current', 'page')

  for (const key of ['about', 'contact'] as const) {
    const { title, description } = site.pages[key]
    const link = nav.getByRole('link', { name: title })
    await link.focus()
    await page.keyboard.press('Enter')
    await expect(link).toHaveAttribute('aria-current', 'page')
    await expect(page.getByRole('main')).toBeFocused()
    await expect(page).toHaveTitle(`${title} · ${site.name}`)
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', description)
  }
  const footer = page.getByRole('contentinfo')
  await expect(footer.getByRole('link', { name: site.email })).toHaveAttribute('href', `mailto:${site.email}`)
  for (const { label, href } of profileLinks) {
    await expect(footer.getByRole('link', { name: label })).toHaveAttribute('href', href)
  }
})

test('every card opens a case study with results and links to the next project', async ({ page }) => {
  for (const [index, project] of projects.entries()) {
    const next = projects[(index + 1) % projects.length]
    await page.goto('/')
    await expect(page.getByRole('article')).toHaveCount(projects.length)
    await page.getByRole('link', { name: `${ui.readMore}: ${project.title}` }).click()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(project.title)
    await expect(page.getByRole('navigation').getByRole('link', { name: 'Work' })).toHaveAttribute('aria-current', 'page')
    await expect(page.getByRole('heading', { name: ui.outcome })).toBeVisible()
    for (const metric of project.metrics) await expect(page.getByText(metric.value, { exact: true })).toBeVisible()
    await expect(page.getByRole('link', { name: `${ui.next} ${next.title}` })).toHaveAttribute('href', `/work/${next.slug}`)
  }
  await page.goto('/work/not-a-project')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(ui.notFound.title)
})

test('uses the OS theme first and persists an explicit keyboard toggle', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await page.getByRole('button', { name: ui.switchToLight }).focus()
  await page.keyboard.press('Space')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
})

function luminance(hex: string) {
  const channels = [1, 3, 5].map(index => parseInt(hex.slice(index, index + 2), 16) / 255)
  return channels.reduce((result, value, index) => {
    const linear = value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
    return result + linear * [0.2126, 0.7152, 0.0722][index]
  }, 0)
}

for (const theme of ['light', 'dark'] as const) {
  test(`${theme} theme text meets WCAG AA on the page and cards`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: theme })
    await page.goto('/')
    const palette = await page.locator('html').evaluate(element =>
      Object.fromEntries(['text', 'text-muted', 'accent', 'bg', 'card'].map(token =>
        [token, getComputedStyle(element).getPropertyValue(`--${token}`).trim()],
      )),
    )
    const ratios = []
    for (const surface of ['bg', 'card']) {
      for (const color of ['text', 'text-muted', 'accent']) {
        const a = luminance(palette[color])
        const b = luminance(palette[surface])
        const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
        ratios.push(`${color}/${surface}=${ratio.toFixed(2)}:1`)
        expect(ratio, `${color} on ${surface}`).toBeGreaterThanOrEqual(4.5)
      }
    }
    console.log(`${theme}: ${ratios.join(', ')}`)
  })
}

for (const width of [360, 768, 1440]) {
  for (const theme of ['light', 'dark'] as const) {
    test(`home and case study fit at ${width}px in ${theme}`, async ({ page }) => {
      await page.setViewportSize({ width, height: width === 1440 ? 1000 : 900 })
      await page.emulateMedia({ colorScheme: theme })
      const evidence = process.env.PORTFOLIO_SCREENSHOTS
      await page.goto('/')
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
      await page.evaluate(() => document.fonts.ready)
      const heading = await page.getByRole('heading', { level: 1 }).evaluate(el => {
        const bounds = el.getBoundingClientRect()
        return { height: bounds.height, lineHeight: parseFloat(getComputedStyle(el).lineHeight) }
      })
      if (width === 1440) {
        expect(heading.height).toBeLessThan(heading.lineHeight * 1.5)
        const support = await page.locator('.hero > p').evaluate(el => ({
          height: el.getBoundingClientRect().height,
          lineHeight: parseFloat(getComputedStyle(el).lineHeight),
        }))
        expect(support.height).toBeLessThan(support.lineHeight * 1.5)
      }
      expect(await page.locator('html').evaluate(el => el.scrollWidth)).toBe(width)
      if (evidence) await page.screenshot({ path: join(evidence, `home-${width}-${theme}.png`) })
      await page.goto(`/work/${projects[0].slug}`)
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(projects[0].title)
      expect(await page.locator('html').evaluate(el => el.scrollWidth)).toBe(width)
      if (evidence && width === 1440 && theme === 'light') {
        await page.screenshot({ path: join(evidence, 'case-study-1440-light.png'), fullPage: true })
      }
    })
  }
}
