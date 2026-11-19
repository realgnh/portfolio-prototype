import { expect, test } from '@playwright/test'
import { join } from 'node:path'
import { projects } from '../src/data/projects'
import { profileLinks, site, ui } from '../src/data/site'

test('keyboard navigation, active sections and metadata follow the route', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('navigation', { name: ui.navigation })).toBeVisible()
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: ui.skip })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('main')).toBeFocused()

  const nav = page.getByRole('navigation', { name: ui.navigation })
  await expect(nav.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page')

  for (const key of ['work', 'contact'] as const) {
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
    await expect(footer.getByRole('link', { name: label, exact: true })).toHaveAttribute('href', href)
  }
})

test('every card opens a case study with results and links to the next project', async ({ page }) => {
  for (const [index, project] of projects.entries()) {
    const next = projects[(index + 1) % projects.length]
    await page.goto('/work')
    await expect(page.getByRole('article')).toHaveCount(projects.length)
    await page.getByRole('link', { name: `${ui.readMore}: ${project.title}` }).click()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(project.title)
    await expect(page.getByRole('navigation').getByRole('link', { name: 'Work' })).toHaveAttribute('aria-current', 'page')
    await expect(page.getByRole('heading', { name: ui.outcome })).toBeVisible()
    for (const metric of project.metrics) await expect(page.getByText(metric.value, { exact: true })).toBeVisible()
    await expect(page.getByRole('heading', { name: ui.faq })).toBeVisible()
    for (const { question, answer } of project.faq) {
      const item = page.getByText(question, { exact: true })
      const response = page.getByText(answer, { exact: true })
      await expect(response).toBeHidden()
      await item.focus()
      await page.keyboard.press('Enter')
      await expect(response).toBeVisible()
      await page.keyboard.press('Enter')
      await expect(response).toBeHidden()
    }
    await expect(page.getByRole('link', { name: `${ui.next} ${next.title}` })).toHaveAttribute('href', `/work/${next.slug}`)
  }
  await page.goto('/work/not-a-project')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(ui.notFound.title)
})

test('home introduces the owner, links to work and includes About and a résumé download', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText(site.hero.intro)).toBeVisible()
  await expect(page.getByRole('img', { name: site.about.portraitLabel })).toBeVisible()
  await expect(page.getByRole('heading', { name: site.skills.heading })).toBeVisible()
  for (const group of site.skills.groups) {
    await expect(page.getByRole('heading', { name: group.title })).toBeVisible()
  }
  await expect(page.getByRole('link', { name: site.work.browse })).toHaveAttribute('href', '/work')
  await expect(page.getByRole('navigation').getByRole('link', { name: 'About' })).toHaveCount(0)
  const about = page.getByRole('region', { name: site.about.heading })
  await expect(about.getByText(site.about.bio, { exact: true })).toBeVisible()
  for (const game of site.about.roblox.games) {
    await expect(about.getByRole('link', { name: game.name })).toHaveAttribute('href', game.href)
  }
  const { label, href } = site.resume.download
  await expect(page.getByRole('link', { name: 'Download portfolio' })).toHaveCount(0)
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('link', { name: label }).click(),
  ])
  expect(download.suggestedFilename()).toBe(href.slice(1))
  expect(await download.failure()).toBeNull()
  const response = await page.request.get(href)
  expect(response.headers()['content-type']).toContain('application/pdf')
  expect((await response.body()).subarray(0, 5).toString()).toBe('%PDF-')

  await page.goto('/about')
  await expect(page).toHaveURL('/#about')
  await expect(about.getByRole('heading', { name: site.about.heading })).toBeInViewport()
})

test('uses the OS theme first and persists an explicit keyboard toggle', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await page.getByRole('button', { name: ui.switchToLight }).focus()
  await page.keyboard.press('Space')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  await expect(page.locator('html')).not.toHaveAttribute('data-theme-transition')
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
})

test('slides the active tab and fades toward each theme when motion is allowed', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'no-preference' })
  await page.addInitScript(() => {
    const start = document.startViewTransition.bind(document)
    document.startViewTransition = (...args: Parameters<typeof start>) => {
      document.documentElement.dataset.viewTransitionInvoked = ''
      return start(...args)
    }
  })
  await page.goto('/')
  const nav = page.getByRole('navigation')
  await expect(nav.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page')
  const indicator = nav.locator('.pill-indicator')
  const homeX = await indicator.evaluate(el => el.getBoundingClientRect().x)
  await nav.getByRole('link', { name: 'Work' }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(site.work.heading)
  await expect(page.locator('html')).toHaveAttribute('data-view-transition-invoked', '')
  await expect.poll(() => indicator.evaluate(el => el.getBoundingClientRect().x)).toBeGreaterThan(homeX + 15)
  for (const [label, theme, animation] of [
    [ui.switchToLight, 'light', 'theme-brighten'],
    [ui.switchToDark, 'dark', 'theme-dim'],
  ]) {
    await page.getByRole('button', { name: label }).click()
    await expect(page.locator('html')).toHaveAttribute('data-theme-transition', theme)
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
    await expect.poll(() => page.evaluate(() => document.getAnimations()
      .flatMap(item => item instanceof CSSAnimation ? [item.animationName] : []))).toContain(animation)
    await expect(page.locator('html')).not.toHaveAttribute('data-theme-transition')
  }
})

test('the project index button shimmers on hover and theme switching has a fallback', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'no-preference' })
  await page.addInitScript(() => Object.defineProperty(document, 'startViewTransition', { value: undefined }))
  await page.goto('/')
  const cta = page.getByRole('link', { name: site.work.browse })
  await cta.hover()
  expect((await cta.boundingBox())?.height).toBeGreaterThanOrEqual(50)
  await expect.poll(() => cta.locator('.cta-shimmer').evaluate(el =>
    getComputedStyle(el, '::before').animationName)).toBe('button-sweep')
  await page.getByRole('button', { name: ui.switchToDark }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await expect(page.locator('html')).toHaveAttribute('data-theme-fallback', '')
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
      expect(heading.height).toBeLessThan(heading.lineHeight * 2.5)
      expect(await page.locator('html').evaluate(el => el.scrollWidth)).toBe(width)
      if (evidence) await page.screenshot({ path: join(evidence, `home-${width}-${theme}.png`) })
      if (evidence && width === 1440) {
        await page.locator('#stack').evaluate(el => el.scrollIntoView({ block: 'start' }))
        await page.screenshot({ path: join(evidence, `home-details-${width}-${theme}.png`) })
      }
      await page.goto('/work')
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(site.work.heading)
      expect(await page.locator('html').evaluate(el => el.scrollWidth)).toBe(width)
      if (evidence && width === 1440 && theme === 'dark') {
        await page.screenshot({ path: join(evidence, 'work-1440-dark.png') })
      }
      await page.goto(`/work/${projects[0].slug}`)
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(projects[0].title)
      expect(await page.locator('html').evaluate(el => el.scrollWidth)).toBe(width)
      if (evidence && width === 1440) {
        await page.screenshot({ path: join(evidence, `case-study-1440-${theme}.png`), fullPage: true })
      }
    })
  }
}
