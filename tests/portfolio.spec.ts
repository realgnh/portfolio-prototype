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
  const toggle = page.getByRole('button', { name: ui.darkMode })
  await expect(toggle).toHaveAttribute('aria-pressed', 'true')
  await toggle.focus()
  await page.keyboard.press('Space')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  await expect(toggle).toHaveAttribute('aria-pressed', 'false')
  await expect(page.locator('.theme-mask')).toHaveCount(0)
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
})

test('slides the active tab and animates the staggered mask in both theme directions', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'no-preference' })
  await page.goto('/')
  const nav = page.getByRole('navigation')
  await expect(nav.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page')
  const indicator = nav.locator('.pill-indicator')
  const homeX = await indicator.evaluate(el => el.getBoundingClientRect().x)
  const work = nav.getByRole('link', { name: 'Work' })
  await work.hover()
  await page.mouse.down()
  await expect(work).toHaveCSS('scale', '1.04')
  await expect(work).toHaveCSS('transition-duration', '0.2s, 0.18s')
  await page.mouse.up()
  await expect(page).toHaveURL('/work')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(site.work.heading)
  await expect(page.locator('.route-frame')).toHaveCSS('animation-name', 'route-in')
  await expect(work).toHaveCSS('transition-duration', '0.2s, 0.18s')
  await expect.poll(() => indicator.evaluate(el => el.getBoundingClientRect().x)).toBeGreaterThan(homeX + 15)
  const toggle = page.getByRole('button', { name: ui.darkMode })
  await toggle.hover()
  await expect(toggle.locator('.theme-label')).toHaveCSS('opacity', '1')
  for (const [theme, previousTheme] of [['light', 'dark'], ['dark', 'light']]) {
    const mask = page.locator('.theme-mask')
    const frame = await toggle.evaluate(button => {
      if (!(button instanceof HTMLButtonElement)) throw new Error('Expected a theme button')
      button.click()
      return new Promise<{ theme: string | undefined; delays: number[]; target: string | undefined }>(resolve => {
        const readMask = () => {
          const element = document.querySelector<HTMLElement>('.theme-mask')
          const delays = (element?.getAnimations({ subtree: true }) ?? [])
            .map(animation => animation.effect?.getTiming().delay ?? -1)
          resolve({ theme: document.documentElement.dataset.theme, delays, target: element?.dataset.themeTarget })
        }
        requestAnimationFrame(() => requestAnimationFrame(readMask))
      })
    })
    expect(frame.target).toBe(theme)
    expect(frame.theme).toBe(previousTheme)
    expect(frame.delays).toEqual(Array.from({ length: 25 }, (_, i) => Math.min(i, 24 - i) * 10))
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
    await expect(mask).toHaveCount(0)
    await expect(toggle).toHaveAttribute('aria-pressed', String(theme === 'dark'))
    await expect(toggle.locator(theme === 'dark' ? '.theme-sun' : '.theme-moon')).toHaveCSS('scale', '1')
  }
})

test('tabs, the theme toggle, and the main CTA ease into and out of scaling', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/')

  for (const control of [
    page.getByRole('link', { name: 'Home', exact: true }),
    page.getByRole('button', { name: ui.darkMode }),
    page.getByRole('link', { name: site.work.browse }),
  ]) {
    const sampleScale = () => control.evaluate(el => {
      const transition = el.getAnimations()
        .find(animation => animation instanceof CSSTransition && animation.transitionProperty === 'scale')
      if (!transition) throw new Error('Expected an active scale transition')
      const frames = [0, 30, 60, 90].map(time => {
        transition.currentTime = time
        const scale = getComputedStyle(el).scale
        return scale === 'none' ? 1 : Number(scale)
      })
      transition.finish()
      return frames
    })

    await control.hover()
    const hover = await sampleScale()
    expect(hover).toEqual([...new Set(hover)].sort((a, b) => a - b))
    expect(hover[0]).toBe(1)
    expect(hover[3]).toBeLessThan(1.02)

    await page.mouse.down()
    const press = await sampleScale()
    expect(press).toEqual([...new Set(press)].sort((a, b) => a - b))
    expect(press[0]).toBeCloseTo(1.02)
    expect(press[3]).toBeLessThan(1.04)

    await page.mouse.move(0, 0)
    await page.mouse.up()
    const release = await sampleScale()
    expect(release).toEqual([...new Set(release)].sort((a, b) => b - a))
    expect(release[0]).toBeCloseTo(1.04)
    expect(release[3]).toBeGreaterThan(1)
  }
})

test.describe('touch preview with reduced motion', () => {
  test.use({ hasTouch: true, isMobile: true, reducedMotion: 'reduce' })

  test('keeps theme, route, tab, and card feedback without a hover-capable pointer', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.goto('/')
    expect(await page.evaluate(() => matchMedia('(hover: none) and (prefers-reduced-motion: reduce)').matches)).toBe(true)
    const toggle = page.getByRole('button', { name: ui.darkMode })
    const box = await toggle.boundingBox()
    if (!box) throw new Error('Expected a visible theme button')
    const input = await page.context().newCDPSession(page)
    const touchPoint = { x: box.x + box.width / 2, y: box.y + box.height / 2 }
    await input.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [touchPoint] })
    await expect(toggle).toHaveCSS('scale', '1.02')
    await input.send('Input.dispatchTouchEvent', { type: 'touchCancel', touchPoints: [] })
    await expect(toggle).not.toHaveAttribute('data-touch-pressed')

    const themeFrame = await toggle.evaluate(button => {
      if (!(button instanceof HTMLButtonElement)) throw new Error('Expected a theme button')
      button.click()
      return new Promise<{ count: number; name: string; transform: string; opacity: number; iconRotation: string } | null>(
        resolve => requestAnimationFrame(() => requestAnimationFrame(() => {
          const mask = document.querySelector('.theme-mask')
          const animations = mask?.getAnimations({ subtree: true }) ?? []
          const band = mask?.firstElementChild
          if (!band) {
            resolve(null)
            return
          }
          const style = getComputedStyle(band)
          resolve({
            count: animations.length,
            name: style.animationName,
            transform: style.transform,
            opacity: Number(style.opacity),
            iconRotation: getComputedStyle(button.querySelector('svg')!).rotate,
          })
        })),
      )
    })
    expect(themeFrame).toEqual({
      count: 25, name: 'theme-band-fade', transform: 'none',
      opacity: expect.any(Number), iconRotation: '0deg',
    })
    expect(themeFrame?.opacity).toBeLessThan(1)
    await expect(toggle).toHaveAttribute('aria-pressed', 'false')

    await page.getByRole('link', { name: 'Work', exact: true }).tap()
    await expect(page).toHaveURL('/work')
    await expect(page.locator('.route-frame')).toHaveCSS('animation-name', 'route-fade')
    await expect(page.locator('.pill-indicator')).toHaveCSS('transition-duration', '0.135s, 0.135s, 0.135s')
    const card = page.locator('.reveal').first()
    await card.scrollIntoViewIfNeeded()
    await expect(card).toHaveCSS('animation-name', 'route-fade')
  })
})

test('the project index button shimmers on hover and the mask works without the Web Animations API', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'no-preference' })
  await page.addInitScript(() => Object.defineProperty(Element.prototype, 'getAnimations', { value: undefined }))
  await page.goto('/')
  const cta = page.getByRole('link', { name: site.work.browse })
  await cta.hover()
  expect((await cta.boundingBox())?.height).toBeGreaterThanOrEqual(50)
  await expect.poll(() => cta.locator('.cta-shimmer').evaluate(el =>
    getComputedStyle(el, '::before').animationName)).toBe('button-sweep')
  await page.getByRole('button', { name: ui.darkMode }).click()
  await expect(page.locator('.theme-mask')).toHaveAttribute('data-theme-target', 'dark')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await expect(page.locator('.theme-mask')).toHaveCount(0)
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
