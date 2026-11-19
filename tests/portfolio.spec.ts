import { expect, test } from '@playwright/test'
import { join } from 'node:path'
import { projects } from '../src/data/projects'
import { contactLinks, site, ui } from '../src/data/site'

test('keyboard navigation, active sections and metadata follow the route', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('navigation', { name: ui.navigation })).toBeVisible()
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: ui.skip })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('main')).toBeFocused()

  const nav = page.getByRole('navigation', { name: ui.navigation })
  await expect(nav.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page')

  for (const key of ['projects', 'resume', 'contact'] as const) {
    const { title, description } = site.pages[key]
    const link = nav.getByRole('link', { name: title })
    await link.focus()
    await page.keyboard.press('Enter')
    await expect(link).toHaveAttribute('aria-current', 'page')
    await expect(page.getByRole('main')).toBeFocused()
    await expect(page).toHaveTitle(`${title} · ${site.name}`)
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', description)
  }
  const contact = page.getByRole('list', { name: ui.contactLinks })
  for (const { label, href } of contactLinks) {
    await expect(contact.getByRole('link', { name: label, exact: true })).toHaveAttribute('href', href)
  }
  const rows = await contact.getByRole('link').evaluateAll(links => links.map(link => ({
    size: parseFloat(getComputedStyle(link).fontSize),
    top: link.getBoundingClientRect().top,
    left: link.getBoundingClientRect().left,
    background: getComputedStyle(link).background,
  })))
  expect(rows).toHaveLength(contactLinks.length)
  for (const row of rows) {
    expect(row.left).toBeCloseTo(rows[0].left)
    expect(row.background).toContain('rgba(0, 0, 0, 0) none')
  }
  for (let i = 1; i < rows.length; i++) {
    expect(rows[i].top).toBeGreaterThan(rows[i - 1].top)
    expect(rows[i].size).toBeLessThan(rows[i - 1].size)
  }
  const footer = page.getByRole('contentinfo')
  await expect(footer.getByRole('link')).toHaveCount(0)
  await expect(footer).toHaveText(site.footer.note)
})

test('every card opens a case study with results and links to the next project', async ({ page }) => {
  for (const [index, project] of projects.entries()) {
    const next = projects[(index + 1) % projects.length]
    await page.goto('/projects')
    await expect(page.getByRole('article')).toHaveCount(projects.length)
    await expect(page.getByRole('link', { name: /read more/i })).toHaveCount(0)
    await page.getByRole('heading', { name: project.title }).getByRole('link', { name: project.title }).click()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(project.title)
    await expect(page.getByRole('navigation').getByRole('link', { name: 'Projects' })).toHaveAttribute('aria-current', 'page')
    const { accomplished, measuredBy, byDoing } = project.xyz
    await expect(page.getByRole('region', { name: ui.projectXyz })).toContainText(`${accomplished}, as measured by ${measuredBy}, by ${byDoing}.`)
    await expect(page.getByRole('heading', { name: 'Role', exact: true })).toHaveCount(0)
    await expect(page.getByText(project.role, { exact: true })).toHaveCount(0)
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
    await expect(page.getByRole('link', { name: `${ui.next} ${next.title}` })).toHaveAttribute('href', `/projects/${next.slug}`)
  }
  await page.goto('/projects/not-a-project')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(ui.notFound.title)
})

test('old Work URLs redirect to Projects without losing query strings or anchors', async ({ page }) => {
  await page.goto('/work')
  await expect(page).toHaveURL('/projects')
  await page.goto(`/work/${projects[0].slug}?from=bookmark#faq-title`)
  await expect(page).toHaveURL(`/projects/${projects[0].slug}?from=bookmark#faq-title`)
  await expect(page.getByRole('heading', { name: projects[0].title, level: 1 })).toBeVisible()
})

test('home introduces the owner, links to Projects and includes About and a résumé shortcut', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText(site.hero.intro)).toBeVisible()
  const hero = page.locator('.hero')
  await expect(hero.getByRole('img')).toHaveCount(0)
  await expect(hero.locator('em')).toHaveCSS('font-style', 'normal')
  expect(await hero.locator('.hero-bar > span').first().evaluate(label => getComputedStyle(label, '::before').content)).toBe('none')
  await expect(page.getByRole('heading', { name: site.skills.heading })).toBeVisible()
  for (const group of site.skills.groups) {
    await expect(page.getByRole('heading', { name: group.title })).toBeVisible()
  }
  await expect(hero.getByRole('link', { name: 'Explore the stack' })).toHaveCount(0)
  await expect(page.getByRole('link', { name: site.projects.browse })).toHaveAttribute('href', '/projects')
  await expect(page.getByRole('navigation').getByRole('link', { name: 'About' })).toHaveCount(0)
  const about = page.getByRole('region', { name: site.about.heading })
  await expect(about.getByText(site.about.bio, { exact: true })).toBeVisible()
  await expect(about.getByText('Also: Roblox development')).toHaveCount(0)
  await expect(page.getByRole('link', { name: site.resume.viewLabel })).toHaveAttribute('href', '/resume')
  await expect(page.getByRole('link', { name: 'Download portfolio' })).toHaveCount(0)

  await page.goto('/about')
  await expect(page).toHaveURL('/#about')
  await expect(about.getByRole('heading', { name: site.about.heading })).toBeInViewport()
})

test('the prominent header shortcut opens the résumé with case studies and a PDF download', async ({ page }) => {
  await page.goto('/')
  const shortcut = page.locator('.masthead-links').getByRole('link', { name: ui.resume })
  const linkedin = page.locator('.masthead-links').getByRole('link', { name: 'LinkedIn' })
  await expect(shortcut).toBeVisible()
  const fontSize = (element: Element) => parseFloat(getComputedStyle(element).fontSize)
  expect(await shortcut.evaluate(fontSize)).toBeGreaterThan(await linkedin.evaluate(fontSize))
  await shortcut.click()
  await expect(page).toHaveURL('/resume')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(site.resume.heading)
  for (const { school, program } of site.resume.education) {
    const education = page.getByRole('region', { name: 'Education' })
    await expect(education.getByText(school, { exact: false })).toBeVisible()
    await expect(education.getByRole('heading', { name: program })).toBeVisible()
  }
  for (const { role } of site.resume.experience) {
    await expect(page.getByRole('region', { name: 'Experience' }).getByRole('heading', { name: role })).toBeVisible()
  }
  for (const { title } of site.skills.groups) {
    await expect(page.getByRole('region', { name: 'Skills' }).getByText(title, { exact: true })).toBeVisible()
  }
  const selected = page.getByRole('region', { name: 'Selected projects' })
  await expect(selected.getByRole('link')).toHaveCount(site.resume.projectSlugs.length)
  for (const project of projects.filter(project => site.resume.projectSlugs.includes(project.slug))) {
    await expect(selected.getByRole('link', { name: project.title })).toHaveAttribute('href', `/projects/${project.slug}`)
  }
  const { label, href } = site.resume.download
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('link', { name: label }).click(),
  ])
  expect(download.suggestedFilename()).toBe(href.slice(1))
  expect(await download.failure()).toBeNull()
  const response = await page.request.get(href)
  expect(response.headers()['content-type']).toContain('application/pdf')
  expect((await response.body()).subarray(0, 5).toString()).toBe('%PDF-')
})

test('the full-width glow softens when scrolling beyond the hero', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/')
  const html = page.locator('html')
  await expect(html).toHaveCSS('--top-glow-opacity', '1.000')
  await page.evaluate(() => window.scrollTo({ top: 520, behavior: 'instant' }))
  await expect(html).toHaveCSS('--top-glow-opacity', '0.680')
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
  await expect(page.locator('html')).toHaveCSS('--theme-blend', '0')
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
})

test('slides the active tab and blends the palette in both theme directions', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'no-preference' })
  await page.goto('/')
  const nav = page.getByRole('navigation')
  await expect(nav.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page')
  const indicator = nav.locator('.pill-indicator')
  const homeX = await indicator.evaluate(el => el.getBoundingClientRect().x)
  const projectsTab = nav.getByRole('link', { name: 'Projects' })
  await projectsTab.hover()
  await page.mouse.down()
  await expect(projectsTab).toHaveCSS('scale', '1.04')
  await expect(projectsTab).toHaveCSS('transition-duration', '0.2s, 0.18s')
  await page.mouse.up()
  await expect(page).toHaveURL('/projects')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(site.projects.heading)
  await expect(page.locator('.route-frame')).toHaveCSS('animation-name', 'route-in')
  await expect(projectsTab).toHaveCSS('transition-duration', '0.2s, 0.18s')
  await expect.poll(() => indicator.evaluate(el => el.getBoundingClientRect().x)).toBeGreaterThan(homeX + 15)
  const toggle = page.getByRole('button', { name: ui.darkMode })
  await toggle.hover()
  await expect(toggle.locator('.theme-label')).toHaveCSS('opacity', '1')
  for (const theme of ['light', 'dark']) {
    const frames = await toggle.evaluate(button => {
      if (!(button instanceof HTMLButtonElement)) throw new Error('Expected a theme button')
      const root = document.documentElement
      button.click()
      return new Promise<number[]>(resolve => {
        const started = performance.now()
        const samples: number[] = []
        function sample() {
          const fading = document.getAnimations().some(animation =>
            animation instanceof CSSAnimation && animation.animationName === 'theme-dissolve')
          if (fading) samples.push(Number(getComputedStyle(root, '::view-transition-old(root)').opacity))
          const ended = samples.length && !fading
          if (ended || performance.now() - started > 1800) resolve(samples)
          else requestAnimationFrame(sample)
        }
        requestAnimationFrame(sample)
      })
    })
    const dark = theme === 'dark'
    expect(frames[0]).toBeGreaterThan(0.9)
    expect(frames.at(-1)).toBeLessThan(0.1)
    expect(frames).toEqual([...frames].sort((a, b) => b - a))
    expect(new Set(frames).size).toBeGreaterThan(8)
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
    await expect(toggle).toHaveAttribute('aria-pressed', String(dark))
    await expect(toggle.locator(dark ? '.theme-sun' : '.theme-moon')).toHaveCSS('scale', '1')
  }
})

test('tabs, the theme toggle, and the main CTA ease into and out of scaling', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/')

  for (const control of [
    page.getByRole('link', { name: 'Home', exact: true }),
    page.getByRole('button', { name: ui.darkMode }),
    page.getByRole('link', { name: site.projects.browse }),
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
      return new Promise<{ opacity: number; duration: string; iconRotation: string }>(resolve => {
        const started = performance.now()
        function sample() {
          const style = getComputedStyle(document.documentElement, '::view-transition-old(root)')
          const opacity = Number(style.opacity)
          const fading = style.animationName === 'theme-dissolve' && opacity > 0 && opacity < 1
          if (fading || performance.now() - started > 700) {
            resolve({ opacity, duration: style.animationDuration, iconRotation: getComputedStyle(button.querySelector('svg')!).rotate })
          } else requestAnimationFrame(sample)
        }
        requestAnimationFrame(sample)
      })
    })
    expect(themeFrame.opacity).toBeGreaterThan(0)
    expect(themeFrame.opacity).toBeLessThan(1)
    expect(themeFrame.duration).toBe('0.2s')
    expect(themeFrame.iconRotation).toBe('0deg')
    await expect(toggle).toHaveAttribute('aria-pressed', 'false')

    await page.getByRole('link', { name: 'Projects', exact: true }).tap()
    await expect(page).toHaveURL('/projects')
    await expect(page.locator('.route-frame')).toHaveCSS('animation-name', 'route-fade')
    await expect(page.locator('.pill-indicator')).toHaveCSS('transition-duration', '0.135s, 0.135s, 0.135s')
    const card = page.locator('.reveal').first()
    await card.scrollIntoViewIfNeeded()
    await expect(card).toHaveCSS('animation-name', 'route-fade')
  })
})

test('the project index button shimmers and theme colors interpolate without View Transitions', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'no-preference' })
  await page.addInitScript(() => Object.defineProperty(document, 'startViewTransition', { value: undefined }))
  await page.goto('/')
  const cta = page.getByRole('link', { name: site.projects.browse })
  await cta.hover()
  expect((await cta.boundingBox())?.height).toBeGreaterThanOrEqual(50)
  await expect.poll(() => cta.locator('.cta-shimmer').evaluate(el =>
    getComputedStyle(el, '::before').animationName)).toBe('button-sweep')
  await page.getByRole('button', { name: ui.darkMode }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  const progress = await page.locator('html').evaluate(root => new Promise<number>(resolve => {
    const element = root as HTMLElement
    function sample() {
      const value = element.style.getPropertyValue('--theme-blend')
      if (value === '0.000') requestAnimationFrame(sample)
      else resolve(value ? Number(value) : 1)
    }
    requestAnimationFrame(sample)
  }))
  expect(progress).toBeGreaterThan(0)
  expect(progress).toBeLessThan(1)
  expect(progress * 1000).toBeCloseTo(Math.round(progress * 1000))
  await expect(page.locator('html')).toHaveCSS('--theme-blend', '1')
})

function luminance(rgb: number[]) {
  return rgb.reduce((result, channel, index) => {
    const value = channel / 255
    const linear = value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
    return result + linear * [0.2126, 0.7152, 0.0722][index]
  }, 0)
}

for (const theme of ['light', 'dark'] as const) {
  test(`${theme} theme text meets WCAG AA on the page and cards`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: theme })
    await page.goto('/')
    const palette = await page.locator('html').evaluate(element => {
      const ctx = document.createElement('canvas').getContext('2d')!
      return Object.fromEntries(['text', 'text-muted', 'accent', 'steel', 'bg', 'card'].map(token => {
        ctx.fillStyle = getComputedStyle(element).getPropertyValue(`--${token}`).trim()
        ctx.fillRect(0, 0, 1, 1)
        return [token, Array.from(ctx.getImageData(0, 0, 1, 1).data.slice(0, 3))]
      }))
    })
    const ratios = []
    for (const surface of ['bg', 'card']) {
      for (const color of ['text', 'text-muted', 'accent', 'steel']) {
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
    test(`home, résumé and case study fit at ${width}px in ${theme}`, async ({ page }) => {
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
      const nav = page.getByRole('navigation')
      await expect(nav.getByRole('link', { name: ui.resume })).toBeInViewport()
      const bounds = await nav.boundingBox()
      expect(bounds!.x).toBeGreaterThanOrEqual(0)
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width)
      expect(await page.locator('html').evaluate(el => el.scrollWidth)).toBe(width)
      if (evidence) await page.screenshot({ path: join(evidence, `home-${width}-${theme}.png`) })
      if (evidence && width === 1440) {
        await page.locator('#stack').evaluate(el => el.scrollIntoView({ block: 'start' }))
        await page.screenshot({ path: join(evidence, `home-details-${width}-${theme}.png`) })
      }
      await page.goto('/projects')
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(site.projects.heading)
      const firstCard = page.getByRole('article').first()
      expect(await firstCard.evaluate(card => parseFloat(getComputedStyle(card).borderRadius))).toBeGreaterThan(0)
      expect(await page.locator('html').evaluate(el => el.scrollWidth)).toBe(width)
      if (evidence && width === 1440 && theme === 'dark') {
        await page.screenshot({ path: join(evidence, 'projects-1440-dark.png') })
      }
      await page.goto(`/projects/${projects[0].slug}`)
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(projects[0].title)
      expect(await page.locator('html').evaluate(el => el.scrollWidth)).toBe(width)
      if (evidence && width === 1440) {
        await page.screenshot({ path: join(evidence, `case-study-1440-${theme}.png`), fullPage: true })
      }
      await page.goto('/resume')
      await expect(page.getByRole('link', { name: site.resume.download.label })).toBeInViewport()
      expect(await page.locator('html').evaluate(el => el.scrollWidth)).toBe(width)
    })
  }
}
