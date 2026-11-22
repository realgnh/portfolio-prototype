/**
 * Ready-made answers for common questions ("intents"), built from your content.
 * The offline chat checks these first; the AI also gets them as facts (lib/knowledge.ts).
 */
import { chat } from '../content/chat'
import { experience } from '../content/experience'
import { hobbyProjects } from '../content/hobbyProjects'
import { profile } from '../content/profile'
import { projects } from '../content/projects'
import { skillAreas, skills } from '../content/skills'
import { formatDuration, formatRange, monthsBetween } from './dates'

export type Answer = { text: string; link?: string }

function list(items: string[]) {
  return items.length <= 1 ? items.join('') : `${items.slice(0, -1).join(', ')} and ${items.at(-1)}`
}

export function longestRole() {
  return [...experience].sort((a, b) => monthsBetween(b.start, b.end) - monthsBetween(a.start, a.end))[0]
}

export function mostImpactfulProject() {
  return projects.find(project => project.slug === chat.mostImpactful.slug) ?? projects[0]
}

const name = profile.firstName

/** Each intent: a pattern that recognises the question, and the answer. Order matters: first match wins. */
export const intents: { id: string; pattern: RegExp; answer: () => Answer }[] = [
  {
    id: 'availability',
    pattern: /\b(open to|available|availability|looking for|hire|hiring|recruit)/i,
    answer: () => ({ text: `${chat.availability} The quickest way to reach ${name} is ${profile.email}.`, link: '/contact' }),
  },
  {
    id: 'longest',
    pattern: /\b(longest|how long|most time|lasted)/i,
    answer: () => {
      const role = longestRole()
      return role
        ? { text: `${name}'s longest role so far is ${role.role} at ${role.company}: ${formatRange(role.start, role.end)}, ${formatDuration(role.start, role.end)} in total.`, link: '/experience' }
        : { text: `${name} hasn't listed any roles yet.` }
    },
  },
  {
    id: 'impact',
    pattern: /\b(impact|impactful|biggest|best|proudest|favou?rite|most important|strongest)\b/i,
    answer: () => {
      const project = mostImpactfulProject()
      return { text: `${name}'s most impactful project is ${project.title}. ${project.summary} It stands out because ${chat.mostImpactful.why}`, link: `/work/${project.slug}` }
    },
  },
  {
    id: 'experience',
    pattern: /\b(experience|worked|work history|internships?|jobs?|roles?|employ)/i,
    answer: () => ({
      text: `${name} has ${experience.length} ${experience.length === 1 ? 'role' : 'roles'} so far: ${list(experience.map(job => `${job.role} at ${job.company} (${formatRange(job.start, job.end)})`))}.`,
      link: '/experience',
    }),
  },
  {
    id: 'projects',
    pattern: /\b(built|build|made|make|projects?|portfolio|created)\b/i,
    answer: () => ({ text: `${name} has built ${projects.length} projects, including ${list(projects.slice(0, 3).map(project => project.title))}. For example, ${projects[0].summary.charAt(0).toLowerCase()}${projects[0].summary.slice(1)}`, link: '/work' }),
  },
  {
    id: 'stack',
    pattern: /\b(stack|skills?|tech|technolog|languages?|tools?|frameworks?|know)\b/i,
    answer: () => ({
      text: `${name} works with ${list((Object.keys(skillAreas) as (keyof typeof skillAreas)[])
        .map(area => ({ label: skillAreas[area].label.toLowerCase(), names: skills.filter(skill => skill.area === area).map(skill => skill.name) }))
        .filter(group => group.names.length)
        .map(group => `${list(group.names)} (${group.label})`))}.`,
      link: '/#skills',
    }),
  },
  {
    id: 'contact',
    pattern: /\b(contact|email|reach|touch|linkedin|message|talk)\b/i,
    answer: () => ({ text: `Email is best: ${profile.email}. ${name} is also on ${list(profile.socials.map(social => social.label))}, all linked on the Contact page.`, link: '/contact' }),
  },
  {
    id: 'hobbies',
    pattern: /\b(roblox|hobb|games?|animat|fun|free time|luau)/i,
    answer: () => ({ text: `${name} builds and animates Roblox games in Luau. The featured one is ${hobbyProjects.featured.title}, and the engineering behind them includes ${list(hobbyProjects.systems.slice(0, 3).map(system => system.title.toLowerCase()))}.`, link: '/hobby-projects' }),
  },
]

export function intentAnswer(question: string): Answer | null {
  const match = intents.find(intent => intent.pattern.test(question))
  return match ? match.answer() : null
}
