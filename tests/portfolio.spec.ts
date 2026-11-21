import { expect, test } from '@playwright/test'
import { join } from 'node:path'
import { experience } from '../src/content/experience'
import { navItems, pages } from '../src/content/navigation'
import { profile } from '../src/content/profile'
import { projects } from '../src/content/projects'
import { sections } from '../src/content/sections'
import { skillAreas, skills } from '../src/content/skills'

const mainNav = (page: import('@playwright/test').Page) => page.getByRole('navigation', { name: 'Main navigation' })

test('keyboard navigation, active page and metadata follow the route', async ({ page }) => {
  await page.goto('/')
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: sections.skip })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('main')).toBeFocused()
  await expect(mainNav(page).getByRole('link', { name: pages.home.label })).toHaveAttribute('aria-current', 'page')

  for (const key of ['projects', 'resume', 'contact'] as const) {
    const { label, title, description } = pages[key]
    const link = mainNav(page).getByRole('link', { name: label })
    await link.focus()
    await page.keyboard.press('Enter')
    await expect(link).toHaveAttribute('aria-current', 'page')
    await expect(page.getByRole('main')).toBeFocused()
    await expect(page).toHaveTitle(`${title} · ${profile.name}`)
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', description)
  }

  await mainNav(page).getByRole('link', { name: pages.experience.label }).click()
  await expect(page).toHaveURL('/#experience')
  await expect(page.getByRole('heading', { name: sections.experience.heading, level: 2 })).toBeInViewport()
  expect(navItems.map(item => item.label)).not.toContain('Experiments')
})

test('hero shows the name, roles, a plain status chip and both buttons', async ({ page }) => {
  await page.goto('/')
  const hero = page.locator('.hero')
  await expect(hero.getByRole('heading', { level: 1 })).toHaveText(`I’m ${profile.name}`)
  const status = hero.locator('.status-chip')
  await expect(status).toHaveText(profile.status)
  await expect(status.locator('*')).toHaveCount(0)
  expect(await status.evaluate(el => getComputedStyle(el, '::before').content)).toBe('none')
  for (const { label } of profile.roles) await expect(hero.getByText(label, { exact: true })).toBeVisible()
  await expect(hero.getByRole('link', { name: sections.hero.primary })).toHaveAttribute('href', '/contact')
  const resume = hero.getByRole('link', { name: sections.hero.secondary })
  await expect(resume).toHaveAttribute('href', profile.resume.href)
  await expect(resume).toHaveAttribute('download', '')
  await hero.getByRole('link', { name: sections.hero.primary }).click()
  await expect(page).toHaveURL('/contact')
})

test('skill bubbles show brand logos and name the tool on hover or focus', async ({ page }) => {
  await page.goto('/')
  const bubbles = page.getByRole('list', { name: sections.hero.skillsLabel }).getByRole('listitem')
  await expect(bubbles).toHaveCount(skills.length)
  for (const [index, skill] of skills.entries()) {
    const bubble = bubbles.nth(index)
    await expect(bubble).toHaveAttribute('aria-label', skill.name)
    if (skill.icon && skill.icon !== 'database') await expect(bubble.locator('svg.brand-logo path')).toHaveAttribute('d', skill.icon.path)
  }
  const first = bubbles.first()
  const tip = first.locator('.bubble-tip')
  await expect(tip).toHaveText(skills[0].name)
  await expect(tip).toHaveCSS('opacity', '0')
  await first.focus()
  await expect(tip).toHaveCSS('opacity', '1')
  await page.mouse.move(0, 0)
  await bubbles.nth(1).hover()
  await expect(bubbles.nth(1).locator('.bubble-tip')).toHaveCSS('opacity', '1')
})

test('bubbles drift with motion allowed and stay still with reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/')
  await expect(page.locator('.bubble-inner').first()).toHaveCSS('animation-name', 'drift')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(page.locator('.bubble-inner').first()).toHaveCSS('animation-name', 'none')
})

test('experience and projects show placeholders until pictures are added', async ({ page }) => {
  await page.goto('/')
  const section = page.getByRole('region', { name: sections.experience.heading })
  for (const { company, role } of experience) {
    await expect(section.getByRole('heading', { name: role })).toBeVisible()
    await expect(section.getByRole('img', { name: `${company} logo (placeholder)` })).toBeVisible()
  }
  const featured = page.getByRole('region', { name: sections.projects.heading }).getByRole('article')
  await expect(featured).toHaveCount(profile.featuredCount)
  for (const project of projects.slice(0, profile.featuredCount)) {
    await expect(page.getByRole('img', { name: `${project.title} screenshot (placeholder)` })).toBeVisible()
  }
  await expect(featured.first().getByText(sections.placeholders.project)).toBeVisible()
})

test('the Projects page filters by area and keeps the choice in the URL', async ({ page }) => {
  await page.goto('/projects')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Projects')
  await expect(page.getByRole('article')).toHaveCount(projects.length)
  const filters = page.getByRole('group', { name: 'Filter projects by area' })
  const area = projects[0].area
  const matching = projects.filter(project => project.area === area)
  await filters.getByRole('button', { name: skillAreas[area].label }).click()
  await expect(page).toHaveURL(`/projects?area=${area}`)
  await expect(page.getByRole('article')).toHaveCount(matching.length)
  await expect(page.getByRole('status').filter({ hasText: 'of' })).toHaveText(`${matching.length} of ${projects.length}`)
  await page.reload()
  await expect(filters.getByRole('button', { name: skillAreas[area].label })).toHaveAttribute('aria-pressed', 'true')
  await filters.getByRole('button', { name: sections.projects.allFilter }).click()
  await expect(page.getByRole('article')).toHaveCount(projects.length)
})

test('every project card opens a detail page with results, questions and neighbours', async ({ page }) => {
  for (const [index, project] of projects.entries()) {
    const next = projects[(index + 1) % projects.length]
    const previous = projects[(index - 1 + projects.length) % projects.length]
    await page.goto('/projects')
    await page.getByRole('link', { name: project.title, exact: true }).click()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(project.title)
    await expect(mainNav(page).getByRole('link', { name: 'Projects' })).toHaveAttribute('aria-current', 'page')
    const { accomplished, measuredBy, byDoing } = project.xyz
    await expect(page.getByRole('region', { name: sections.project.summary })).toContainText(`${accomplished}, as measured by ${measuredBy}, by ${byDoing}.`)
    for (const metric of project.metrics) await expect(page.getByText(metric.value, { exact: true })).toBeVisible()
    for (const tool of project.tools) await expect(page.locator('.facts').getByText(tool, { exact: true })).toBeVisible()
    for (const { question, answer } of project.faq) {
      await expect(page.getByText(answer, { exact: true })).toBeHidden()
      await page.getByText(question, { exact: true }).click()
      await expect(page.getByText(answer, { exact: true })).toBeVisible()
    }
    await expect(page.locator('a[rel="next"]')).toHaveAttribute('href', `/projects/${next.slug}`)
    await expect(page.locator('a[rel="prev"]')).toHaveAttribute('href', `/projects/${previous.slug}`)
  }
  await page.goto('/projects/not-a-project')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(sections.notFound.title)
})

test('the quick menu opens with Ctrl+K, finds a project and closes with Escape', async ({ page }) => {
  await page.goto('/')
  const opener = page.getByRole('button', { name: sections.commandMenu.label })
  await opener.focus()
  await page.keyboard.press('Control+k')
  const dialog = page.getByRole('dialog', { name: sections.commandMenu.label })
  await expect(dialog).toBeVisible()
  await expect(dialog.getByRole('combobox')).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  await expect(opener).toBeFocused()

  await opener.click()
  await page.keyboard.type(projects[2].title)
  await expect(dialog.getByRole('option')).toHaveCount(1)
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(`/projects/${projects[2].slug}`)
  await expect(dialog).toBeHidden()

  await page.keyboard.press('Control+k')
  await page.keyboard.type('zzzz')
  await expect(dialog.getByText(sections.commandMenu.empty)).toBeVisible()
})

test('copying the email shows a toast and fills the clipboard', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.goto('/contact')
  await page.getByRole('main').getByRole('button', { name: sections.contact.copy }).click()
  await expect(page.locator('.toast')).toHaveText(sections.toast.copied)
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(profile.email)
})

test('Contact shows the local time in Cairo and the social links', async ({ page }) => {
  await page.goto('/contact')
  const expected = await page.evaluate(zone => new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', timeZone: zone }).format(new Date()), profile.timeZone)
  expect(profile.timeZone).toBe('Africa/Cairo')
  await expect(page.getByRole('region', { name: sections.contact.localTime })).toContainText(expected)
  for (const { label, href } of profile.socials) {
    await expect(page.getByRole('list', { name: 'Contact links' }).getByRole('link', { name: label })).toHaveAttribute('href', href)
  }
})

test('the résumé lists experience with logos, skills and a PDF download', async ({ page }) => {
  await page.goto('/resume')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(sections.resume.heading)
  for (const { role, company } of experience) {
    const region = page.getByRole('region', { name: sections.resume.experience })
    await expect(region.getByRole('heading', { name: role })).toBeVisible()
    await expect(region.getByRole('img', { name: `${company} logo (placeholder)` })).toBeVisible()
  }
  for (const skill of skills) await expect(page.getByRole('region', { name: sections.resume.skills }).getByText(skill.name, { exact: true })).toBeVisible()
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('main').getByRole('link', { name: profile.resume.label }).click(),
  ])
  expect(download.suggestedFilename()).toBe('resume.pdf')
  const response = await page.request.get(profile.resume.href)
  expect((await response.body()).subarray(0, 5).toString()).toBe('%PDF-')
})

test('old URLs redirect', async ({ page }) => {
  await page.goto(`/work/${projects[0].slug}?from=bookmark`)
  await expect(page).toHaveURL(`/projects/${projects[0].slug}?from=bookmark`)
  await page.goto('/experience')
  await expect(page).toHaveURL('/#experience')
})

test('uses the OS theme first and remembers an explicit choice', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  const toggle = page.getByRole('button', { name: sections.theme.label })
  await expect(toggle).toHaveAttribute('aria-pressed', 'true')
  await toggle.click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
})

function luminance(rgb: number[]) {
  return rgb.reduce((sum, channel, index) => {
    const value = channel / 255
    const linear = value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
    return sum + linear * [0.2126, 0.7152, 0.0722][index]
  }, 0)
}

for (const theme of ['light', 'dark'] as const) {
  test(`${theme} theme text meets WCAG AA, including on every pastel tone`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: theme })
    await page.goto('/')
    const tones = ['butter', 'peach', 'mint', 'lilac', 'sky']
    const names = ['text', 'text-muted', 'accent', 'bg', 'surface', 'accent-soft', ...tones.flatMap(tone => [`tone-${tone}`, `tone-${tone}-ink`])]
    const palette = await page.locator('html').evaluate((element, list) => {
      const ctx = document.createElement('canvas').getContext('2d')!
      return Object.fromEntries(list.map(name => {
        ctx.fillStyle = getComputedStyle(element).getPropertyValue(`--${name}`).trim()
        ctx.fillRect(0, 0, 1, 1)
        return [name, Array.from(ctx.getImageData(0, 0, 1, 1).data.slice(0, 3))]
      }))
    }, names)
    const ratio = (a: string, b: string) => {
      const [x, y] = [luminance(palette[a]), luminance(palette[b])]
      return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)
    }
    for (const surface of ['bg', 'surface']) {
      for (const color of ['text', 'text-muted', 'accent']) expect(ratio(color, surface), `${color} on ${surface}`).toBeGreaterThanOrEqual(4.5)
    }
    expect(ratio('text', 'accent-soft')).toBeGreaterThanOrEqual(4.5)
    for (const tone of tones) expect(ratio(`tone-${tone}-ink`, `tone-${tone}`), tone).toBeGreaterThanOrEqual(4.5)
  })
}

for (const width of [360, 768, 1440]) {
  for (const theme of ['light', 'dark'] as const) {
    test(`every page fits at ${width}px in ${theme}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.emulateMedia({ colorScheme: theme })
      const evidence = process.env.PORTFOLIO_SCREENSHOTS
      for (const path of ['/', '/projects', `/projects/${projects[0].slug}`, '/resume', '/contact']) {
        await page.goto(path)
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
        await page.evaluate(() => document.fonts.ready)
        expect(await page.locator('html').evaluate(el => el.scrollWidth), path).toBe(width)
        if (evidence) await page.screenshot({ path: join(evidence, `${path === '/' ? 'home' : path.slice(1).replaceAll('/', '-')}-${width}-${theme}.png`), fullPage: true })
      }
      if (width === 360) {
        await page.getByRole('button', { name: 'Menu', exact: true }).click()
        await expect(mainNav(page).getByRole('link', { name: pages.resume.label })).toBeVisible()
      } else if (width === 1440) {
        await expect(mainNav(page).getByRole('link', { name: pages.resume.label })).toBeVisible()
      }
    })
  }
}
