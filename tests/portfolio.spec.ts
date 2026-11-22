import { expect, test } from '@playwright/test'
import { join } from 'node:path'
import { experience } from '../src/content/experience'
import { hobbies } from '../src/content/hobbies'
import { formatDuration, formatMonth, formatRange } from '../src/lib/dates'
import { differenceFrom, greetingFor } from '../src/lib/timeGreeting'
import { easterEgg } from '../src/content/easterEggs'
import { milestones } from '../src/content/milestones'
import { navItems, pages } from '../src/content/navigation'
import { profile } from '../src/content/profile'
import { projects } from '../src/content/projects'
import { sections } from '../src/content/sections'
import { skillAreas, skills } from '../src/content/skills'

const mainNav = (page: import('@playwright/test').Page) => page.getByRole('navigation', { name: 'Main navigation' })

// The loading screen has its own test; every other test skips it.
test.beforeEach(async ({ context }, info) => {
  if (!info.title.includes('loading screen')) await context.addInitScript(() => localStorage.setItem('portfolio-skip-loader', '1'))
})

test('keyboard navigation, active page and metadata follow the route', async ({ page }) => {
  await page.goto('/')
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: sections.skip })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('main')).toBeFocused()
  await expect(mainNav(page).getByRole('link', { name: pages.home.label })).toHaveAttribute('aria-current', 'page')

  for (const key of ['projects', 'experience', 'resume', 'contact'] as const) {
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
  await expect(page).toHaveURL('/experience')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(pages.experience.title)
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
  await expect(hero.getByRole('link', { name: sections.hero.scrollCue })).toHaveAttribute('href', '#experience')
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

test('animations are on by default, even when the OS asks for less motion, and can be switched off', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'on')
  const float = page.locator('.bubble-float').first()
  await expect(float).toHaveCSS('animation-name', /wander-[123]/)
  const names = await page.locator('.bubble-float').evaluateAll(els => els.map(el => getComputedStyle(el).animationDuration))
  expect(new Set(names).size).toBeGreaterThan(3)
  await expect(page.locator('.route-frame')).toHaveCSS('animation-name', 'page-in')

  const toggle = page.getByRole('button', { name: sections.motion.label })
  await expect(toggle).toHaveAttribute('aria-pressed', 'true')
  await toggle.click()
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'off')
  await expect(float).toHaveCSS('animation-duration', '0.001s')
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'off')
  await expect(page.getByRole('button', { name: sections.motion.label })).toHaveAttribute('aria-pressed', 'false')
})

test('the loading screen plays on a fresh load but not when changing pages', async ({ page }) => {
  await page.goto('/')
  const loader = page.getByRole('progressbar', { name: sections.loader.title })
  await expect(loader).toBeVisible()
  await expect(loader).toContainText(sections.loader.title)
  expect(await loader.locator('.loader-logos svg').count()).toBeGreaterThan(3)
  await expect(loader.locator('.loader-block')).toBeVisible()
  await expect(loader).toBeHidden({ timeout: 4000 })
  await mainNav(page).getByRole('link', { name: pages.projects.label }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(pages.projects.title)
  await expect(loader).toHaveCount(0)
  await expect(page.locator('.route-progress')).toHaveCount(1)
})

test('About, Skills, Hobbies and Currently sections are on Home', async ({ page }) => {
  await page.goto('/')
  const about = page.locator('#about')
  await expect(about.getByText(profile.about.statement)).toBeVisible()
  for (const { value } of profile.about.facts) await expect(about.getByText(value, { exact: true })).toBeVisible()
  await expect(about.getByText(profile.now.learning)).toBeVisible()
  await expect(about.getByRole('img', { name: `Photo of ${profile.name} (placeholder)` })).toBeVisible()

  const skillsRegion = page.getByRole('region', { name: sections.skills.heading, exact: true })
  for (const skill of skills) await expect(skillsRegion.getByText(skill.name, { exact: true })).toBeVisible()
  expect(skills.map(skill => skill.name)).toEqual(expect.arrayContaining(['Luau', 'Java']))
  expect(skills.map(skill => skill.name)).not.toContain('Git')

  const hobbyRegion = page.getByRole('region', { name: sections.hobbies.heading })
  for (const { title } of hobbies) await expect(hobbyRegion.getByRole('heading', { name: title })).toBeVisible()
  await expect(hobbyRegion).toContainText('Roblox')

  const currently = page.getByRole('heading', { name: sections.currently.heading })
  await expect(currently).toBeVisible()
  await expect(currently.locator('.dots span')).toHaveCount(3)
})

test('dates show month ranges and inclusive durations', () => {
  expect(formatRange('2026-04', '2026-06')).toBe('April 2026 – June 2026')
  expect(formatDuration('2026-04', '2026-06')).toBe('3 months')
  expect(formatDuration('2026-06', '2026-06')).toBe('1 month')
  expect(formatDuration('2025-01', '2026-02')).toBe('1 year 2 months')
  expect(formatDuration('2024-01', '2025-12')).toBe('2 years')
  expect(formatRange('2025-10', 'present')).toBe('October 2025 – Present')
})

test('Home shows recent experience and links to the timeline on the Experience page', async ({ page }) => {
  await page.goto('/')
  const section = page.getByRole('region', { name: sections.experience.heading, exact: true })
  await expect(section.getByRole('listitem')).toHaveCount(sections.experience.homeCount)
  await section.getByRole('link', { name: sections.experience.all }).click()
  await expect(page).toHaveURL('/experience')
  const items = page.locator('.timeline-item')
  await expect(items).toHaveCount(experience.length + projects.length + milestones.length)
  for (const { role, start, end, highlights } of experience) {
    const item = items.filter({ has: page.getByRole('heading', { name: role }) })
    await expect(item).toContainText(formatRange(start, end))
    await expect(item).toContainText(formatDuration(start, end))
    for (const line of highlights) await expect(item).toContainText(line)
  }
  for (const project of projects) {
    await expect(items.filter({ hasText: project.title }).getByRole('link', { name: project.title })).toHaveAttribute('href', `/projects/${project.slug}`)
    await expect(items.filter({ hasText: project.title })).toContainText(formatMonth(project.date))
  }
  for (const milestone of milestones) await expect(items.filter({ hasText: milestone.title })).toContainText(milestone.emoji)
  const sortKeys = await items.evaluateAll(els => els.length)
  expect(sortKeys).toBeGreaterThan(0)

  const fill = () => page.locator('.timeline').evaluate(el => Number(getComputedStyle(el).getPropertyValue('--fill')))
  const before = await fill()
  await page.mouse.wheel(0, 900)
  await expect.poll(fill).toBeGreaterThan(before)
  await expect(page.locator('.timeline-item[data-reached]').first()).toBeVisible()
})

test('sections fade in on every page and bubbles pop in', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/')
  await expect(page.locator('.bubble-inner').first()).toHaveCSS('animation-name', 'bubble-pop')
  for (const path of ['/', '/projects', '/experience', '/resume', '/contact']) {
    await page.goto(path)
    const first = page.locator('.reveal').first()
    await expect(first).toHaveClass(/is-visible/)
    expect(await page.locator('.reveal').count()).toBeGreaterThan(1)
  }
  await mainNav(page).getByRole('link', { name: pages.projects.label }).click()
  await expect(page.locator('.route-frame .reveal').first()).toHaveClass(/is-visible/)
})

test('project cards glow where the cursor is', async ({ page }) => {
  await page.goto('/projects')
  const card = page.locator('.project-card').first()
  const box = (await card.boundingBox())!
  await page.mouse.move(box.x + 40, box.y + 60)
  await page.mouse.move(box.x + 50, box.y + 70)
  await expect(card).toHaveCSS('--glow-x', '50px')
  await expect.poll(() => card.evaluate(el => getComputedStyle(el, '::before').opacity)).toBe('1')
})

test('the easter egg answers its easy triggers and unlocks the brick loading screen', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('contentinfo')).toContainText(easterEgg.hint)
  await page.locator('body').click({ position: { x: 5, y: 300 } })
  await page.keyboard.type(easterEgg.secretWord)
  const egg = page.locator('.egg')
  await expect(egg).toContainText(easterEgg.speech)
  await egg.getByRole('button', { name: 'Dismiss' }).click()
  await expect(egg).toHaveCount(0, { timeout: 3000 })

  for (const key of easterEgg.arrowCode) await page.keyboard.press(key)
  await expect(egg).toBeVisible()
  await egg.getByRole('button', { name: 'Dismiss' }).click()
  await expect(egg).toHaveCount(0, { timeout: 3000 })

  for (let i = 0; i < easterEgg.logoClicks; i++) await page.locator('.monogram').first().click()
  await expect(egg).toBeVisible()
  expect(await page.evaluate(() => localStorage.getItem('portfolio-brick'))).toBe('1')

  // Typing the word inside Quick search must not trigger it.
  await egg.getByRole('button', { name: 'Dismiss' }).click()
  await expect(egg).toHaveCount(0, { timeout: 3000 })
  await page.keyboard.press('Control+k')
  await page.keyboard.type(easterEgg.secretWord)
  await page.waitForTimeout(300)
  await expect(egg).toHaveCount(0)
})

test('brick mode changes the loading screen cube', async ({ page, context }) => {
  await context.addInitScript(() => localStorage.setItem('portfolio-brick', '1'))
  await page.goto('/')
  await expect(page.locator('.loader')).toHaveAttribute('data-brick', 'true')
})

test('visitor greeting and time difference', () => {
  expect(greetingFor(8)).toBe('Good morning!')
  expect(greetingFor(14)).toBe('Good afternoon!')
  expect(greetingFor(19)).toBe('Good evening!')
  expect(greetingFor(2)).toBe('Hey, night owl!')
  const winter = new Date('2026-01-15T12:00:00Z')
  expect(differenceFrom('Africa/Cairo', winter, 'Africa/Cairo')).toBe('We’re in the same time zone.')
  expect(differenceFrom('Africa/Cairo', winter, 'Europe/London')).toBe('It’s 2 hours later for me.')
  expect(differenceFrom('Africa/Cairo', winter, 'Asia/Kolkata')).toBe('It’s 3 hours 30 minutes earlier for me.')
})

test('experience and projects show placeholders until pictures are added', async ({ page }) => {
  await page.goto('/')
  const section = page.getByRole('region', { name: sections.experience.heading, exact: true })
  for (const { company, role } of experience.slice(0, sections.experience.homeCount)) {
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
    await expect(page.locator('.facts').getByText('Role', { exact: true })).toHaveCount(0)
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

test('Quick search opens with Ctrl+K, finds a project, runs actions and closes with Escape', async ({ page }) => {
  await page.goto('/')
  const opener = page.getByRole('button', { name: sections.commandMenu.button })
  await expect(opener).toHaveText(sections.commandMenu.button)
  await expect(opener.locator('.search-label')).toBeVisible()
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
  await page.keyboard.press('Escape')

  const before = await page.locator('html').getAttribute('data-theme')
  await page.keyboard.press('Control+k')
  await page.keyboard.type('light / dark')
  await expect(dialog.getByRole('option')).toHaveCount(1)
  await page.keyboard.press('Enter')
  await expect(page.locator('html')).not.toHaveAttribute('data-theme', before!)
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
  expect(profile.timeZone).toBe('Africa/Cairo')
  const clock = page.getByRole('region', { name: sections.contact.localTime }).locator('time')
  await expect(clock).toHaveText(/^\d{1,2}:\d{2}:\d{2}\s?(AM|PM)$/)
  const hourMinute = await page.evaluate(zone => new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', timeZone: zone }).format(new Date()), profile.timeZone)
  await expect(clock).toContainText(hourMinute.split(' ')[0])
  const first = await clock.textContent()
  await expect(clock).not.toHaveText(first!, { timeout: 2500 })
  await expect(page.locator('.time-greeting')).toHaveText(/^(Good (morning|afternoon|evening)!|Hey, night owl!) (It’s .+ (later|earlier) for me\.|We’re in the same time zone\.)$/)
  const links = page.getByRole('list', { name: 'Contact links' }).getByRole('link')
  for (const [index, { label, href }] of profile.socials.entries()) await expect(links.nth(index)).toHaveAttribute('href', href)
  const sizes = await links.evaluateAll(els => els.map(el => parseFloat(getComputedStyle(el).fontSize)))
  for (let i = 1; i < sizes.length; i++) expect(sizes[i], 'less important links are smaller').toBeLessThan(sizes[i - 1])
})

test('the résumé lists experience with logos, skills and a PDF download', async ({ page }) => {
  await page.goto('/resume')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(sections.resume.heading)
  expect(await page.getByRole('main').getByRole('heading', { level: 2 }).allTextContents())
    .toEqual([sections.resume.education, sections.resume.experience, sections.resume.projects, sections.resume.skills])
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
})

test('uses the OS theme first and remembers an explicit choice', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  const toggle = page.getByRole('button', { name: sections.theme.label, exact: true })
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
    const tones = ['butter', 'peach', 'mint', 'lilac', 'sky', 'rose']
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
      for (const path of ['/', '/projects', `/projects/${projects[0].slug}`, '/experience', '/resume', '/contact']) {
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
