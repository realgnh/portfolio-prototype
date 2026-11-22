import { expect, test } from '@playwright/test'
import { join } from 'node:path'
import { experience } from '../src/content/experience'
import { hobbyProjects } from '../src/content/hobbyProjects'
import { formatDuration, formatMonth, formatRange } from '../src/lib/dates'
import { differenceFrom, greetingFor } from '../src/lib/timeGreeting'
import { easterEgg } from '../src/content/easterEggs'
import { milestones } from '../src/content/milestones'
import { shortcuts } from '../src/content/shortcuts'
import { chat } from '../src/content/chat'
import { formatDuration as duration } from '../src/lib/dates'
import { longestRole, mostImpactfulProject } from '../src/lib/chatAnswers'
import { parseContributions } from '../src/lib/contributions'
import { localAnswer } from '../src/lib/localAnswer'
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
  // Home is both the "AK." logo and the first menu tab.
  await expect(page.locator('.monogram').first()).toHaveAttribute('href', '/')
  expect(navItems.map(item => item.label)).toEqual(['Home', 'Work', 'Hobby projects', 'Experience', 'Contact'])

  for (const key of ['projects', 'hobby', 'experience', 'contact'] as const) {
    const { label, title, description } = pages[key]
    const link = mainNav(page).getByRole('link', { name: label })
    await link.focus()
    await page.keyboard.press('Enter')
    await expect(link).toHaveAttribute('aria-current', 'page')
    await expect(page.getByRole('main')).toBeFocused()
    await expect(page).toHaveTitle(`${title} · ${profile.name}`)
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', description)
  }

  // The résumé is a button in the header rather than a menu item.
  await page.locator('.resume-button').click()
  await expect(page).toHaveURL('/resume')
  await expect(page).toHaveTitle(`${pages.resume.title} · ${profile.name}`)
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', pages.resume.description)

  await mainNav(page).getByRole('link', { name: pages.experience.label }).click()
  await expect(page).toHaveURL('/experience')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(pages.experience.title)
  expect(navItems.map(item => item.label)).not.toContain('Experiments')
})

test('hero shows the name, roles, a plain status line and both buttons', async ({ page }) => {
  await page.goto('/')
  const hero = page.locator('.hero')
  await expect(hero.getByRole('heading', { level: 1 })).toHaveText(`${profile.name}.`)
  await expect(hero.locator('.hero-name .hero-dot')).toHaveText('.')
  await expect(hero.locator('.hero-roles')).toHaveText(profile.roles.join(' / '))
  await expect(hero.getByText(profile.headline, { exact: true })).toBeVisible()
  await expect(hero.locator('.hero-status')).toHaveText(profile.status)
  await expect(hero.locator('.status-chip')).toHaveCount(0)
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

test('bubbles pop when clicked or pressed with Enter, and can pop again', async ({ page }) => {
  await page.goto('/')
  const bubble = page.locator('.bubble').first()
  const burst = bubble.locator('.bubble-burst')
  await bubble.click()
  await expect(burst).toHaveAttribute('data-pop', '')
  await expect(burst).toHaveCSS('animation-name', 'bubble-burst')
  await expect(burst).not.toHaveAttribute('data-pop', { timeout: 2000 })
  // Spamming restarts the pop from the beginning.
  await bubble.click()
  await page.waitForTimeout(150)
  await bubble.click()
  const [time] = await burst.evaluate(el => el.getAnimations().map(animation => Number(animation.currentTime)))
  expect(time, 'the pop restarted instead of continuing from 150ms').toBeLessThan(100)
  await expect(burst).not.toHaveAttribute('data-pop', { timeout: 2000 })
  await bubble.focus()
  await page.keyboard.press('Enter')
  await expect(burst).toHaveAttribute('data-pop', '')
  await expect(burst.locator('.sparks i').first()).toHaveCSS('animation-name', 'spark-shoot')
  await expect(burst.locator('.sparks')).toHaveCSS('animation-name', 'spark-fall')
  await expect(page.locator('.bubble-inner').first()).toHaveCSS('animation-name', 'bubble-pop')
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
  await expect(loader.locator('.jump-hint')).toHaveText(sections.loader.gameHint)
  await expect(loader).toBeHidden({ timeout: 4000 })
  await mainNav(page).getByRole('link', { name: pages.projects.label }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(pages.projects.title)
  await expect(loader).toHaveCount(0)
  // The old colour sweep is gone; the scroll ruler is on every page.
  await expect(page.locator('.route-progress')).toHaveCount(0)
  await expect(page.locator('.ruler')).toHaveCount(1)
})

test('Selected work, Skills and About sections are on Home', async ({ page }) => {
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

  await expect(about.locator('.currently')).toContainText(profile.currently)
  // The old Currently cards and the hobbies section are gone.
  await expect(page.locator('.currently-list')).toHaveCount(0)
  await expect(page.getByRole('region', { name: 'Outside of class' })).toHaveCount(0)

  const work = page.locator('#work')
  await expect(work.getByRole('heading', { level: 2, name: sections.projects.heading })).toBeVisible()
  await expect(work.locator('.work-lead').getByRole('link', { name: projects[0].title })).toHaveAttribute('href', `/work/${projects[0].slug}`)
  // The grid holds the remaining featured projects plus the featured hobby game.
  await expect(work.locator('.work-grid > li')).toHaveCount(profile.featuredCount)
  await expect(work.locator('.work-grid').getByRole('link', { name: hobbyProjects.featured.title })).toHaveAttribute('href', '/hobby-projects')
  await expect(work.getByRole('link', { name: sections.projects.all })).toHaveAttribute('href', '/work')
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
    await expect(items.filter({ hasText: project.title }).getByRole('link', { name: project.title })).toHaveAttribute('href', `/work/${project.slug}`)
    await expect(items.filter({ hasText: project.title })).toContainText(formatMonth(project.date))
  }
  for (const milestone of milestones) await expect(items.filter({ hasText: milestone.title })).toContainText('◆')
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
  for (const path of ['/', '/work', '/hobby-projects', '/experience', '/resume', '/contact']) {
    await page.goto(path)
    const first = page.locator('.reveal').first()
    await expect(first).toHaveClass(/is-visible/)
    expect(await page.locator('.reveal').count()).toBeGreaterThan(1)
  }
  await mainNav(page).getByRole('link', { name: pages.projects.label }).click()
  await expect(page.locator('.route-frame .reveal').first()).toHaveClass(/is-visible/)
})

test('project cards glow where the cursor is', async ({ page }) => {
  await page.goto('/work')
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
  await expect(page.locator('.loader-logos-window')).toBeVisible()
  await expect(page.locator('.loader-logos svg').first()).toHaveCSS('filter', 'brightness(0) invert(1)')
})

test('bubbles stay below the header, the logo scrolls Home back to the top, and the favicon loads', async ({ page }) => {
  await page.goto('/')
  const headerBottom = await page.locator('.site-header').evaluate(el => el.getBoundingClientRect().bottom)
  const tops = await page.locator('.bubble').evaluateAll(els => els.map(el => el.getBoundingClientRect().top))
  // Each bubble may drift up to ~22px and lean ~10px toward the cursor.
  for (const top of tops) expect(top - 32).toBeGreaterThan(headerBottom)

  await page.mouse.wheel(0, 1200)
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(300)
  await page.locator('.monogram').first().click()
  // Smooth (our own animation, so it works even when the OS turns browser smooth scrolling off): not at the top instantly.
  await page.waitForTimeout(120)
  expect(await page.evaluate(() => scrollY)).toBeGreaterThan(0)
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0)

  for (const href of ['/favicon.svg', '/favicon-32.png', '/apple-touch-icon.png']) {
    await expect(page.locator(`link[href="${href}"]`)).toHaveCount(1)
    expect((await page.request.get(href)).ok()).toBe(true)
  }
})

test('headings use Bricolage Grotesque and text uses IBM Plex Sans', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toHaveCSS('font-family', /Bricolage Grotesque/)
  await expect(page.locator('body')).toHaveCSS('font-family', /^"?IBM Plex Sans/)
  expect(await page.evaluate(() => document.fonts.check('800 40px "Bricolage Grotesque"'))).toBe(true)
})

test('About is short and the Skills section has no card backgrounds', async ({ page }) => {
  await page.goto('/')
  const about = page.locator('#about')
  await expect(about.getByRole('heading', { name: sections.about.heading })).toBeVisible()
  await expect(about.getByText('About me', { exact: true })).toHaveCount(0)
  // Statement, paragraph and the one-line "currently".
  await expect(about.locator('.about-body > p')).toHaveCount(3)
  const backgrounds = await page.locator('.skill-group').evaluateAll(els => els.map(el => getComputedStyle(el).backgroundColor))
  for (const background of backgrounds) expect(background).toBe('rgba(0, 0, 0, 0)')
})

test('keyboard shortcuts navigate, toggle and show the ? cheat sheet', async ({ page }) => {
  await page.goto('/')
  await page.locator('body').click({ position: { x: 5, y: 300 } })
  await page.keyboard.press('?')
  const help = page.getByRole('dialog', { name: sections.shortcuts.title })
  await expect(help).toBeVisible()
  for (const { label } of shortcuts) await expect(help.getByText(label, { exact: true })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(help).toBeHidden()

  await page.keyboard.press('g')
  await page.keyboard.press('w')
  await expect(page).toHaveURL('/work')
  await page.keyboard.press('g')
  await page.keyboard.press('b')
  await expect(page).toHaveURL('/hobby-projects')
  expect(shortcuts.map(item => item.keys.join(''))).not.toEqual(expect.arrayContaining(['gp']))
  await page.keyboard.press('g')
  await page.keyboard.press('e')
  await expect(page).toHaveURL('/experience')
  const theme = await page.locator('html').getAttribute('data-theme')
  await page.keyboard.press('t')
  await expect(page.locator('html')).not.toHaveAttribute('data-theme', theme!)
  await page.keyboard.press('/')
  await expect(page.getByRole('dialog', { name: sections.commandMenu.label })).toBeVisible()
  // Shortcuts don't fire while typing.
  await page.keyboard.type('gw')
  await expect(page).toHaveURL('/experience')
})

test('Ask my portfolio answers with the AI when available and offline otherwise, fading text in', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: sections.chat.title }).click()
  const chatPanel = page.getByRole('dialog', { name: sections.chat.title })
  await expect(chatPanel).toBeVisible()
  for (const suggestion of chat.suggestions) await expect(chatPanel.getByRole('button', { name: suggestion })).toBeVisible()
  await expect(chatPanel.locator('.chat-chip')).toHaveCount(chat.suggestions.length)
  await expect(chatPanel.getByText(sections.chat.greeting)).toBeVisible()
  // No /api/ask in local development → offline answer from the site's own content.
  await chatPanel.getByRole('button', { name: chat.suggestions[0] }).click()
  const last = chatPanel.locator('li[data-role="assistant"]').last()
  await expect(last).toContainText(projects[0].title)
  await expect(last.locator('.chat-words span').first()).toHaveCSS('animation-name', 'word-in')
  expect(await last.locator('.chat-words span').count()).toBeGreaterThan(5)
  await expect(chatPanel.getByRole('link', { name: sections.chat.open })).toHaveAttribute('href', '/work')
  // Unasked suggestions stay available.
  await expect(chatPanel.getByRole('button', { name: chat.suggestions[1] })).toBeVisible()

  await page.route('**/api/ask', route => route.fulfill({ json: { answer: 'Abdalla builds software and applied AI projects.' } }))
  await chatPanel.getByRole('textbox').fill('Summarise Abdalla')
  await chatPanel.getByRole('button', { name: sections.chat.send }).click()
  await expect(chatPanel.locator('.chat-typing')).toBeVisible()
  await expect(chatPanel.locator('li[data-role="assistant"]').last().locator('.chat-words')).toHaveText('Abdalla builds software and applied AI projects.')
  // Scrolling over the chat never scrolls the page behind it.
  const before = await page.evaluate(() => scrollY)
  const box = (await chatPanel.boundingBox())!
  await page.mouse.move(box.x + box.width / 2, box.y + 30)
  await page.mouse.wheel(0, 800)
  await page.waitForTimeout(300)
  expect(await page.evaluate(() => scrollY)).toBe(before)

  await page.keyboard.press('Escape')
  await expect(chatPanel).toBeHidden()
  await page.keyboard.press('a')
  await expect(chatPanel).toBeVisible()
})

test('a small keyboard button opens the shortcuts list', async ({ page }) => {
  await page.goto('/')
  await page.locator('.floating-actions').getByRole('button', { name: sections.shortcuts.title }).click()
  await expect(page.getByRole('dialog', { name: sections.shortcuts.title })).toBeVisible()
  const launcher = page.getByRole('button', { name: sections.chat.title })
  expect((await launcher.boundingBox())!.height).toBeGreaterThanOrEqual(52)
})

test('offline answers give clear answers to common questions', () => {
  expect(localAnswer('What has Abdalla built?').link).toBe('/work')
  expect(localAnswer('What is the tech stack?').link).toBe('/#skills')
  expect(localAnswer('How can I contact Abdalla?').link).toBe('/contact')
  expect(localAnswer('Does Abdalla do Roblox?').link).toBe('/hobby-projects')

  const open = localAnswer('Is Abdalla open to internships?')
  expect(open.text).toContain(chat.availability)
  expect(open.text).toContain(profile.email)

  const experienceAnswer = localAnswer('What experience does Abdalla have?')
  expect(experienceAnswer.link).toBe('/experience')
  for (const job of experience) expect(experienceAnswer.text).toContain(job.company)

  const longest = localAnswer('What was Abdalla’s longest internship?')
  const role = longestRole()
  expect(longest.text).toContain(role.company)
  expect(longest.text).toContain(duration(role.start, role.end))

  const impact = localAnswer('What’s Abdalla’s most impactful project?')
  expect(impact.text).toContain(mostImpactfulProject().title)
  expect(impact.link).toBe(`/work/${chat.mostImpactful.slug}`)
})

test('GitHub on Contact: contribution chart and activity, looked up by permanent ID', async ({ page }) => {
  const thisMonth = new Date().toISOString().slice(0, 7)
  const requested: string[] = []
  const days = Array.from({ length: 365 }, (_, index) => {
    const date = new Date(Date.now() - (364 - index) * 86400000).toISOString().slice(0, 10)
    return { date, count: index % 50 === 0 ? 3 : 0, level: index % 50 === 0 ? 2 : 0 }
  })
  await page.route('**/api/github-contributions?login=renamed-user', route => route.fulfill({ json: { total: 24, days } }))
  await page.route('https://api.github.com/**', route => {
    const url = route.request().url()
    requested.push(url)
    if (url.includes(`/user/${profile.github.id}`)) return route.fulfill({ json: { login: 'renamed-user', name: null, avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4', html_url: 'https://github.com/renamed-user', public_repos: 3, followers: 2 } })
    if (url.includes('/users/renamed-user/repos')) return route.fulfill({ json: [{ name: 'secret-repo', full_name: 'renamed-user/secret-repo', description: 'Private', language: 'Go', stargazers_count: 0, html_url: 'https://github.com/renamed-user/secret-repo', pushed_at: new Date().toISOString(), created_at: new Date().toISOString(), fork: false, private: true, visibility: 'private' }, { name: 'cool-repo', full_name: 'renamed-user/cool-repo', description: 'A repo', language: 'TypeScript', stargazers_count: 5, html_url: 'https://github.com/renamed-user/cool-repo', pushed_at: new Date().toISOString(), created_at: new Date().toISOString(), fork: false }] })
    if (url.includes('/commits')) return route.fulfill({ json: Array.from({ length: 4 }, () => ({ commit: { author: { date: new Date().toISOString() } } })) })
    if (url.includes('/pulls/7')) return route.fulfill({ json: { title: 'Add a feature', html_url: 'https://github.com/renamed-user/cool-repo/pull/7', merged_at: new Date().toISOString(), created_at: new Date().toISOString() } })
    return route.fulfill({ json: [{ type: 'PullRequestEvent', repo: { name: 'renamed-user/cool-repo' }, created_at: new Date().toISOString(), payload: { action: 'opened', number: 7 } }] })
  })
  await page.route('https://avatars.githubusercontent.com/**', route => route.fulfill({ status: 204 }))
  await page.goto('/')
  await expect(page.getByRole('region', { name: sections.github.heading })).toHaveCount(0)
  await page.goto('/contact')
  const panel = page.getByRole('region', { name: sections.github.heading })
  await panel.scrollIntoViewIfNeeded()
  await expect(panel).toContainText('24 contributions in the last year')
  await expect(panel.locator('.calendar-grid i[data-level]')).toHaveCount(365)
  const square = panel.locator('.calendar-grid i[data-level="2"]').first()
  await square.hover()
  await expect(panel.getByRole('tooltip')).toHaveText(/^3 contributions on [A-Z][a-z]+ \d{1,2}(st|nd|rd|th)$/)
  await expect(panel.getByText('secret-repo')).toHaveCount(0)
  await expect(panel).toContainText('Created 4 commits in 1 repository')
  await expect(panel).toContainText('Created 1 repository')
  await expect(panel.locator('.github-repos li')).toHaveCount(1)
  await expect(panel.getByRole('link', { name: 'Add a feature' })).toHaveAttribute('href', 'https://github.com/renamed-user/cool-repo/pull/7')
  await expect(panel.locator('.activity-month').first()).toContainText(thisMonth.slice(0, 4))
  await expect(panel.getByRole('link', { name: sections.github.profile })).toHaveAttribute('href', 'https://github.com/renamed-user')
  expect(requested[0]).toContain(`/user/${profile.github.id}`)
  expect(requested.some(url => url.includes('/commits?author=renamed-user'))).toBe(true)
})

test('click pops swell once and settle without extra bounces', async ({ page }) => {
  await page.goto('/')
  const burst = page.locator('.bubble').first().locator('.bubble-burst')
  await page.locator('.bubble').first().click()
  const scales = await burst.evaluate(el => {
    const animation = el.getAnimations().find(item => (item as CSSAnimation).animationName === 'bubble-burst')!
    const duration = Number(animation.effect!.getComputedTiming().duration)
    return Array.from({ length: 21 }, (_, step) => {
      animation.currentTime = (duration * step) / 20
      const matrix = new DOMMatrix(getComputedStyle(el).transform)
      return matrix.a
    })
  })
  const peak = scales.indexOf(Math.max(...scales))
  // Rises to one peak, then only shrinks back to 1 (never dips below and comes back up).
  for (let i = 1; i <= peak; i++) expect(scales[i]).toBeGreaterThanOrEqual(scales[i - 1] - 0.001)
  for (let i = peak + 1; i < scales.length; i++) expect(scales[i]).toBeLessThanOrEqual(scales[i - 1] + 0.001)
  expect(Math.min(...scales)).toBeGreaterThanOrEqual(0.999)
})

test('the GitHub year picker loads each calendar year', async ({ page }) => {
  const asked: string[] = []
  await page.route('**/api/github-contributions?**', route => {
    const url = new URL(route.request().url())
    asked.push(url.search)
    const year = url.searchParams.get('year')
    const days = Array.from({ length: 30 }, (_, index) => ({ date: `${year ?? '2026'}-01-${String(index + 1).padStart(2, '0')}`, count: 1, level: 1 }))
    return route.fulfill({ json: { total: year ? Number(year) % 100 : 42, days, year: year ? Number(year) : null } })
  })
  await page.route('https://api.github.com/**', route => {
    const url = route.request().url()
    if (url.includes(`/user/${profile.github.id}`)) return route.fulfill({ json: { login: 'someone', name: null, avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4', html_url: 'https://github.com/someone', public_repos: 1, followers: 0, created_at: '2023-05-01T00:00:00Z' } })
    return route.fulfill({ json: [] })
  })
  await page.route('https://avatars.githubusercontent.com/**', route => route.fulfill({ status: 204 }))
  await page.goto('/contact')
  const panel = page.getByRole('region', { name: sections.github.heading })
  await panel.scrollIntoViewIfNeeded()
  await expect(panel).toContainText('42 contributions in the last year')
  const picker = panel.getByRole('group', { name: sections.github.yearPicker })
  const thisYear = new Date().getFullYear()
  await expect(picker.getByRole('button')).toHaveCount(1 + (thisYear - 2023 + 1))
  await picker.getByRole('button', { name: '2024' }).click()
  await expect(panel).toContainText('24 contributions in 2024')
  await expect(picker.getByRole('button', { name: '2024' })).toHaveAttribute('aria-pressed', 'true')
  expect(asked.some(search => search.includes('year=2024'))).toBe(true)
})

test('the contribution parser reads GitHub calendar HTML', () => {
  const html = `<h2 class="f4"> 42
      contributions
        in the last year </h2>
    <td tabindex="0" data-ix="0" data-date="2026-11-20" id="contribution-day-component-5-50" data-level="0" role="gridcell"></td>
    <td tabindex="0" data-date="2026-11-21" id="contribution-day-component-6-50" data-level="3" role="gridcell"></td>
    <tool-tip id="t1" for="contribution-day-component-5-50" popover="manual">No contributions on November 20th.</tool-tip>
    <tool-tip id="t2" for="contribution-day-component-6-50" popover="manual">9 contributions on November 21st.</tool-tip>`
  expect(parseContributions(html)).toEqual({ total: 42, days: [{ date: '2026-11-20', count: 0, level: 0 }, { date: '2026-11-21', count: 9, level: 3 }] })
})

test('the Clearpath project has a working interactive demo', async ({ page }) => {
  await page.goto(`/work/${projects[0].slug}`)
  const demo = page.getByRole('region', { name: sections.project.demo })
  await demo.getByRole('button', { name: /After/ }).click()
  for (let i = 0; i < 2; i++) await demo.getByRole('button', { name: /Continue/ }).click()
  await demo.getByRole('button', { name: /Finish/ }).click()
  await expect(demo.getByRole('status')).toContainText('Done in')
  await expect(demo.locator('.demo-results')).toContainText(/After: 3 steps\s*\d+\.\ds/)
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
  const featured = page.locator('#work').getByRole('article')
  // The lead project, the other featured projects and the featured hobby game.
  await expect(featured).toHaveCount(profile.featuredCount + 1)
  for (const project of projects.slice(0, profile.featuredCount)) {
    await expect(page.getByRole('img', { name: `${project.title} screenshot (placeholder)` })).toBeVisible()
  }
  await expect(page.getByRole('img', { name: `${hobbyProjects.featured.title} screenshot (placeholder)` })).toBeVisible()
  await expect(featured.first().getByText(sections.placeholders.project)).toBeVisible()
})

test('the Work page filters by area and keeps the choice in the URL', async ({ page }) => {
  await page.goto('/work')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(pages.projects.title)
  await expect(page.getByRole('article')).toHaveCount(projects.length)
  const filters = page.getByRole('group', { name: 'Filter projects by area' })
  const area = projects[0].area
  const matching = projects.filter(project => project.area === area)
  await filters.getByRole('button', { name: skillAreas[area].label }).click()
  await expect(page).toHaveURL(`/work?area=${area}`)
  await expect(page.getByRole('article')).toHaveCount(matching.length)
  await expect(page.getByRole('status').filter({ hasText: 'of' })).toHaveText(`${matching.length} of ${projects.length}`)
  await page.reload()
  await expect(filters.getByRole('button', { name: skillAreas[area].label })).toHaveAttribute('aria-pressed', 'true')
  await filters.getByRole('button', { name: sections.projects.allFilter }).click()
  await expect(page.getByRole('article')).toHaveCount(projects.length)
  // Filters are underlined text tabs, and each project card shows its result as a big number.
  await expect(filters.locator('button.filter').first()).toHaveAttribute('aria-pressed', 'true')
  await expect(page.locator('.card-result')).toHaveCount(projects.length)
})

test('every project card opens a detail page with results, questions and neighbours', async ({ page }) => {
  for (const [index, project] of projects.entries()) {
    const next = projects[(index + 1) % projects.length]
    const previous = projects[(index - 1 + projects.length) % projects.length]
    await page.goto('/work')
    await page.getByRole('link', { name: project.title, exact: true }).click()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(project.title)
    await expect(mainNav(page).getByRole('link', { name: pages.projects.label })).toHaveAttribute('aria-current', 'page')
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
    await expect(page.locator('a[rel="next"]')).toHaveAttribute('href', `/work/${next.slug}`)
    await expect(page.locator('a[rel="prev"]')).toHaveAttribute('href', `/work/${previous.slug}`)
  }
  await page.goto('/work/not-a-project')
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
  await expect(dialog.getByRole('option').first()).toContainText(sections.commandMenu.surprise)
  await page.keyboard.type(projects[2].title)
  await expect(dialog.getByRole('option')).toHaveCount(1)
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(`/work/${projects[2].slug}`)
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

test('old URLs redirect to the new pages', async ({ page }) => {
  await page.goto('/projects')
  await expect(page).toHaveURL('/work')
  await page.goto('/projects?area=ai')
  await expect(page).toHaveURL('/work?area=ai')
  await page.goto('/projects/clearpath-onboarding')
  await expect(page).toHaveURL('/work/clearpath-onboarding')
  await page.goto(`/projects/${projects[0].slug}?from=bookmark`)
  await expect(page).toHaveURL(`/work/${projects[0].slug}?from=bookmark`)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(projects[0].title)
})

test('the Hobby projects page shows the featured game and the systems behind it', async ({ page }) => {
  await page.goto('/hobby-projects')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(pages.hobby.title)
  const { featured, games, systems } = hobbyProjects
  const game = page.locator('.game-featured')
  await expect(game.getByRole('heading', { level: 2, name: featured.title })).toBeVisible()
  await expect(game).toContainText(sections.hobby.featured)
  for (const stat of featured.stats) await expect(game).toContainText(stat.value)
  await expect(game.locator('ul.tags li')).toHaveCount(featured.tags.length)
  if (featured.url) await expect(game.getByRole('link', { name: sections.hobby.play })).toHaveAttribute('href', featured.url)
  for (const { title } of games) await expect(page.getByRole('heading', { level: 3, name: title })).toBeVisible()
  const band = page.getByRole('region', { name: sections.hobby.systems })
  await expect(band.getByRole('heading', { level: 2 })).toHaveText(sections.hobby.systems)
  for (const { title } of systems) await expect(band.getByRole('heading', { level: 3, name: title })).toBeVisible()
  await expect(mainNav(page).getByRole('link', { name: pages.hobby.label })).toHaveAttribute('aria-current', 'page')
})

test('the scroll ruler has one keyframe per scene on Home', async ({ page }) => {
  await page.goto('/')
  const scenes = await page.locator('main [data-scene]').evaluateAll(els => els.map(el => (el as HTMLElement).dataset.scene))
  expect(scenes.length).toBeGreaterThan(4)
  const ruler = page.locator('.ruler')
  await expect(ruler.locator('.ruler-key')).toHaveCount(scenes.length)
  await expect(ruler.locator('.ruler-key').first()).toHaveText(scenes[0]!)
  await expect(ruler.locator('.ruler-key').first()).toHaveAttribute('data-active', 'true')
  // Clicking a keyframe scrolls to that section, and it becomes the current one.
  const skills = ruler.getByRole('button', { name: 'Skills', exact: true })
  await skills.click()
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(500)
  await expect(skills).toHaveAttribute('data-active', 'true')
  // Keyframes are spread out, not stacked at the end.
  const lefts = await ruler.locator('.ruler-key').evaluateAll(els => els.map(el => parseFloat((el as HTMLElement).style.left)))
  expect(new Set(lefts.map(left => Math.round(left))).size).toBe(lefts.length)
})

test('the ruler runs from 0 at the top of the page to 1 at the bottom', async ({ page }) => {
  await page.goto('/')
  const ruler = page.locator('.ruler')
  const progress = () => ruler.evaluate(el => Number(getComputedStyle(el).getPropertyValue('--progress')))
  await expect.poll(progress).toBe(0)
  await expect(ruler.locator('.ruler-key').first()).toHaveAttribute('data-active', 'true')
  await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight))
  await expect.poll(progress).toBe(1)
  await expect(ruler.locator('.ruler-key').last()).toHaveAttribute('data-active', 'true')
})

test('pressing T quickly still animates and ends on the right theme', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'no-preference' })
  await page.goto('/')
  await page.locator('body').click({ position: { x: 5, y: 400 } })
  await page.keyboard.press('t')
  await page.keyboard.press('t')
  await page.keyboard.press('t')
  // A switch is animating, and three presses land on dark.
  await expect(page.locator('html')).toHaveAttribute('data-theme-switch', '')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await expect(page.locator('html')).not.toHaveAttribute('data-theme-switch', { timeout: 3000 })
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  // Holding the key doesn't repeat the toggle.
  await page.keyboard.down('t')
  await page.keyboard.down('t')
  await page.keyboard.up('t')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
})

test('links that leave the site open in a new tab', async ({ page }) => {
  await page.goto('/contact')
  const links = page.getByRole('list', { name: 'Contact links' }).getByRole('link')
  for (const link of await links.all()) {
    await expect(link).toHaveAttribute('target', '_blank')
    await expect(link).toHaveAttribute('rel', /noopener/)
  }
  for (const link of await page.getByRole('contentinfo').locator('a[href^="http"]').all()) await expect(link).toHaveAttribute('target', '_blank')
  await expect(page.getByRole('main').locator('a[href^="mailto:"]').first()).not.toHaveAttribute('target', '_blank')
})

test('the header puts AK. far left, the tabs after it and the actions far right', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 800 })
  await page.goto('/')
  const box = async (selector: string) => (await page.locator(selector).first().boundingBox())!
  const [logo, nav, actions] = [await box('.monogram'), await box('.site-nav'), await box('.header-actions')]
  expect(logo.x).toBeLessThan(60)
  expect(nav.x).toBeGreaterThan(logo.x + logo.width)
  expect(nav.x + nav.width / 2).toBeLessThan(720 - 50) // left of centre, leaving space
  expect(actions.x + actions.width).toBeGreaterThan(1440 - 60)
})

test('page changes wait for the slate to cover the screen', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' }) // the site keeps animations on regardless
  await page.goto('/')
  await mainNav(page).getByRole('link', { name: pages.projects.label }).click()
  // Straight after the click the slate is showing and we haven't left Home yet.
  await expect(page.locator('.slate')).toBeVisible()
  expect(new URL(page.url()).pathname).toBe('/')
  await expect(page).toHaveURL('/work')
  await expect(page.locator('.slate-name')).toHaveText(pages.projects.title)
  await expect(page.locator('.slate')).toHaveCount(0, { timeout: 3000 })
})

test('the 404 page has a jump game that starts with Space', async ({ page }) => {
  await page.goto('/no-such-page')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(sections.notFound.title)
  await expect(page.getByText(sections.notFound.code)).toBeVisible()
  await expect(page.locator('.jump-stage')).toBeVisible()
  const hint = page.locator('.jump-stage .jump-hint')
  await expect(hint).toHaveText(sections.notFound.gameHint)
  await page.locator('body').click({ position: { x: 5, y: 300 } })
  await page.keyboard.press('Space')
  await expect(hint).toContainText('Cleared')
  await expect(page.locator('.jump-stage .is-leaping')).toHaveCount(1)
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
  test(`${theme} theme text meets WCAG AA on the page and on the black band`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: theme })
    await page.goto('/')
    const names = ['text', 'text-muted', 'accent', 'bg', 'surface', 'band', 'band-text', 'band-muted']
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
    for (const color of ['band-text', 'band-muted']) expect(ratio(color, 'band'), `${color} on band`).toBeGreaterThanOrEqual(4.5)
  })
}

for (const width of [360, 768, 1440]) {
  for (const theme of ['light', 'dark'] as const) {
    test(`every page fits at ${width}px in ${theme}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.emulateMedia({ colorScheme: theme })
      const evidence = process.env.PORTFOLIO_SCREENSHOTS
      for (const path of ['/', '/work', `/work/${projects[0].slug}`, '/hobby-projects', '/experience', '/resume', '/contact']) {
        await page.goto(path)
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
        await page.evaluate(() => document.fonts.ready)
        expect(await page.locator('html').evaluate(el => el.scrollWidth), path).toBe(width)
        if (evidence) await page.screenshot({ path: join(evidence, `${path === '/' ? 'home' : path.slice(1).replaceAll('/', '-')}-${width}-${theme}.png`), fullPage: true })
      }
      if (width === 360) {
        await page.getByRole('button', { name: 'Menu', exact: true }).click()
        await expect(mainNav(page).locator('.nav-resume')).toBeVisible()
      } else if (width === 1440) {
        await expect(page.locator('.resume-button')).toBeVisible()
      }
    })
  }
}
