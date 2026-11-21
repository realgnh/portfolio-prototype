import { expect, test } from '@playwright/test'
import { join } from 'node:path'
import { projects } from '../src/data/projects'
import { contactLinks, recordNumber, site, ui } from '../src/data/site'

test('keyboard navigation, active page and metadata follow the route', async ({ page }) => {
  await page.goto('/')
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: ui.skip })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('main')).toBeFocused()

  const nav = page.getByRole('navigation', { name: ui.navigation })
  await expect(nav.getByRole('link', { name: site.pages.home.title })).toHaveAttribute('aria-current', 'page')

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
  for (const { href } of contactLinks) {
    await expect(contact.locator(`a[href="${href}"]`)).toBeVisible()
  }
  await expect(page.getByRole('contentinfo')).toContainText(site.footer.note)
})

test('home shows the hero sheet, featured experiments, instruments with evidence, and the lab log', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(site.name)
  await expect(page.getByText(site.hero.intro)).toBeVisible()
  await expect(page.getByRole('img', { name: site.hero.figure.caption })).toBeVisible()

  const register = page.getByRole('region', { name: site.projects.register })
  await expect(register.getByRole('article')).toHaveCount(site.projects.featuredCount)
  const [first] = projects
  const card = register.getByRole('article').first()
  await expect(card).toContainText(`${ui.experiment} 01`)
  await expect(card).toContainText(first.hypothesis)
  await expect(card).toContainText(first.method)
  await expect(card.locator('mark')).toHaveText(first.metrics[0].value)
  await expect(register.getByRole('link', { name: site.projects.browse })).toHaveAttribute('href', '/projects')

  const instruments = page.getByRole('region', { name: site.skills.eyebrow })
  for (const group of site.skills.groups) {
    await expect(instruments.getByRole('heading', { name: group.title })).toBeVisible()
  }
  for (const [index, project] of projects.entries()) {
    for (const tool of project.tools) {
      await expect(instruments.getByRole('link', { name: `${tool}: ${ui.experiment} ${recordNumber(index)}, ${project.title}` }))
        .toHaveAttribute('href', `/projects/${project.slug}`)
    }
  }

  const log = page.getByRole('region', { name: site.log.eyebrow })
  await expect(log.getByRole('listitem')).toHaveCount(site.log.entries.length)

  await page.goto('/about')
  await expect(page).toHaveURL('/#about')
})

test('the register filters by topic and keeps the choice in the URL', async ({ page }) => {
  await page.goto('/projects')
  await expect(page.getByRole('article')).toHaveCount(projects.length)
  const filters = page.getByRole('group', { name: site.projects.filterLabel })
  await expect(filters.getByRole('button', { name: site.projects.allLabel })).toHaveAttribute('aria-pressed', 'true')

  const topic = projects[0].tags![0]
  const matching = projects.filter(project => project.tags?.includes(topic))
  await filters.getByRole('button', { name: topic, exact: true }).click()
  await expect(page).toHaveURL(`/projects?topic=${encodeURIComponent(topic)}`)
  await expect(page.getByRole('article')).toHaveCount(matching.length)
  await expect(page.getByRole('status')).toContainText(`${recordNumber(matching.length - 1)} ${ui.records}`)

  await page.reload()
  await expect(filters.getByRole('button', { name: topic, exact: true })).toHaveAttribute('aria-pressed', 'true')
  await filters.getByRole('button', { name: site.projects.allLabel }).click()
  await expect(page).toHaveURL('/projects')
  await expect(page.getByRole('article')).toHaveCount(projects.length)
})

test('every card opens a case study with readouts, FAQs and record navigation', async ({ page }) => {
  for (const [index, project] of projects.entries()) {
    const next = projects[(index + 1) % projects.length]
    const previous = projects[(index - 1 + projects.length) % projects.length]
    await page.goto('/projects')
    await page.getByRole('heading', { name: project.title }).getByRole('link').click()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(project.title)
    await expect(page.getByRole('navigation', { name: ui.navigation }).getByRole('link', { name: site.pages.projects.title })).toHaveAttribute('aria-current', 'page')
    const { accomplished, measuredBy, byDoing } = project.xyz
    await expect(page.getByRole('region', { name: ui.projectXyz })).toContainText(`${accomplished}, as measured by ${measuredBy}, by ${byDoing}.`)
    const readouts = page.getByRole('region', { name: ui.readouts })
    for (const metric of project.metrics) await expect(readouts.getByText(metric.value, { exact: true })).toBeVisible()
    for (const { question, answer } of project.faq) {
      const response = page.getByText(answer, { exact: true })
      await expect(response).toBeHidden()
      await page.getByText(question, { exact: true }).focus()
      await page.keyboard.press('Enter')
      await expect(response).toBeVisible()
    }
    await expect(page.locator('a[rel="next"]')).toHaveAttribute('href', `/projects/${next.slug}`)
    await expect(page.locator('a[rel="prev"]')).toHaveAttribute('href', `/projects/${previous.slug}`)
  }
  await page.goto('/projects/not-a-project')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(ui.notFound.title)
})

test('old Work URLs redirect to Projects without losing query strings or anchors', async ({ page }) => {
  await page.goto('/work')
  await expect(page).toHaveURL('/projects')
  await page.goto(`/work/${projects[0].slug}?from=bookmark#faq-title`)
  await expect(page).toHaveURL(`/projects/${projects[0].slug}?from=bookmark#faq-title`)
})

test('the résumé lists education, experience, skills and selected experiments with a PDF download', async ({ page }) => {
  await page.goto('/resume')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(site.resume.heading)
  for (const { program } of site.resume.education) {
    await expect(page.getByRole('region', { name: 'Education' }).getByRole('heading', { name: program })).toBeVisible()
  }
  for (const { role } of site.resume.experience) {
    await expect(page.getByRole('region', { name: 'Experience' }).getByRole('heading', { name: role })).toBeVisible()
  }
  const selected = page.getByRole('region', { name: 'Selected experiments' })
  await expect(selected.getByRole('link')).toHaveCount(site.resume.projectSlugs.length)
  const { label, href } = site.resume.download
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('link', { name: label }).click(),
  ])
  expect(download.suggestedFilename()).toBe(href.slice(1))
  const response = await page.request.get(href)
  expect((await response.body()).subarray(0, 5).toString()).toBe('%PDF-')
})

test('copy email puts the address on the clipboard and announces it', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.goto('/contact')
  await page.getByRole('main').getByRole('button', { name: ui.copyEmail }).click()
  await expect(page.getByRole('main').getByRole('status')).toHaveText(ui.copied)
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(site.email)
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
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
})

function luminance(rgb: number[]) {
  return rgb.reduce((result, channel, index) => {
    const value = channel / 255
    const linear = value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
    return result + linear * [0.2126, 0.7152, 0.0722][index]
  }, 0)
}

for (const theme of ['light', 'dark'] as const) {
  test(`${theme} theme text meets WCAG AA on paper, cards and highlights`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: theme })
    await page.goto('/')
    const palette = await page.locator('html').evaluate(element => {
      const ctx = document.createElement('canvas').getContext('2d')!
      return Object.fromEntries(['text', 'text-muted', 'accent', 'bg', 'card', 'highlight', 'hover'].map(token => {
        ctx.fillStyle = getComputedStyle(element).getPropertyValue(`--${token}`).trim()
        ctx.fillRect(0, 0, 1, 1)
        return [token, Array.from(ctx.getImageData(0, 0, 1, 1).data.slice(0, 3))]
      }))
    })
    for (const surface of ['bg', 'card', 'highlight', 'hover']) {
      for (const color of surface === 'highlight' || surface === 'hover' ? ['text'] : ['text', 'text-muted', 'accent']) {
        const a = luminance(palette[color])
        const b = luminance(palette[surface])
        const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
        expect(ratio, `${color} on ${surface}`).toBeGreaterThanOrEqual(4.5)
      }
    }
  })
}

for (const width of [360, 768, 1440]) {
  for (const theme of ['light', 'dark'] as const) {
    test(`every page fits at ${width}px in ${theme}`, async ({ page }) => {
      await page.setViewportSize({ width, height: width === 1440 ? 1000 : 900 })
      await page.emulateMedia({ colorScheme: theme })
      const evidence = process.env.PORTFOLIO_SCREENSHOTS
      for (const path of ['/', '/projects', `/projects/${projects[0].slug}`, '/resume', '/contact']) {
        await page.goto(path)
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
        await page.evaluate(() => document.fonts.ready)
        expect(await page.locator('html').evaluate(el => el.scrollWidth), path).toBe(width)
        await expect(page.getByRole('navigation', { name: ui.navigation }).getByRole('link', { name: ui.resume })).toBeInViewport()
        if (evidence) {
          const name = path === '/' ? 'home' : path.slice(1).replaceAll('/', '-')
          await page.screenshot({ path: join(evidence, `${name}-${width}-${theme}.png`), fullPage: true })
        }
      }
      if (width === 1440) {
        await page.goto('/')
        const heading = await page.getByRole('heading', { level: 1 }).evaluate(el => ({
          height: el.getBoundingClientRect().height, line: parseFloat(getComputedStyle(el).lineHeight) || parseFloat(getComputedStyle(el).fontSize),
        }))
        expect(heading.height).toBeLessThan(heading.line * 1.6)
      }
    })
  }
}
