/**
 * Everything "Ask my portfolio" knows, built from the files in src/content.
 * Used by the AI (functions/api/ask.ts) and by the offline fallback (lib/localAnswer.ts),
 * so updating your content updates the chat automatically.
 */
import { chat } from '../content/chat'
import { experience } from '../content/experience'
import { hobbyProjects } from '../content/hobbyProjects'
import { milestones } from '../content/milestones'
import { profile } from '../content/profile'
import { projects } from '../content/projects'
import { skillAreas, skills } from '../content/skills'
import { longestRole, mostImpactfulProject } from './chatAnswers'
import { formatDuration, formatRange } from './dates'

export type KnowledgeDoc = { title: string; text: string; link?: string; keywords: string }

export function knowledgeDocs(): KnowledgeDoc[] {
  return [
    {
      title: `About ${profile.firstName}`,
      text: `${profile.about.statement} ${profile.about.paragraph} ${profile.about.facts.map(fact => `${fact.label}: ${fact.value}.`).join(' ')} Status: ${profile.status}.`,
      link: '/#about',
      keywords: 'about who background bio student university study studying intro yourself',
    },
    {
      title: 'Contact',
      text: `Email ${profile.email}. ${profile.socials.map(social => `${social.label}: ${social.href}`).join('. ')}. Local time zone: ${profile.timeZone}. Résumé PDF: ${profile.resume.href}.`,
      link: '/contact',
      keywords: 'contact email reach hire message linkedin github resume cv talk',
    },
    {
      title: 'Skills',
      text: (Object.keys(skillAreas) as (keyof typeof skillAreas)[])
        .map(area => `${skillAreas[area].label}: ${skills.filter(skill => skill.area === area).map(skill => skill.name).join(', ')}`)
        .filter(line => !line.endsWith(': '))
        .join('. ') + '.',
      link: '/#skills',
      keywords: 'skills stack tech technologies languages tools frameworks know use program',
    },
    {
      title: 'Availability',
      text: chat.availability,
      link: '/contact',
      keywords: 'open available availability internship hire hiring looking',
    },
    {
      title: 'Longest role',
      text: (() => { const role = longestRole(); return role ? `${role.role} at ${role.company}, ${formatRange(role.start, role.end)} (${formatDuration(role.start, role.end)}).` : 'No roles listed yet.' })(),
      link: '/experience',
      keywords: 'longest long internship role duration',
    },
    {
      title: 'Most impactful project',
      text: `${mostImpactfulProject().title}: ${mostImpactfulProject().summary} Why: ${chat.mostImpactful.why}`,
      link: `/work/${mostImpactfulProject().slug}`,
      keywords: 'impact impactful best biggest proudest project',
    },
    {
      title: 'Projects overview',
      text: `${profile.firstName} has built ${projects.length} projects: ${projects.map(project => `${project.title} (${project.summary})`).join(' ')}`,
      link: '/work',
      keywords: 'projects project built build made making portfolio work examples shipped created',
    },
    {
      title: 'Experience overview',
      text: experience.map(job => `${job.role} at ${job.company}, ${formatRange(job.start, job.end)}.`).join(' '),
      link: '/experience',
      keywords: 'experience work worked job jobs internship internships intern roles employment career',
    },
    ...experience.map(job => ({
      title: `${job.role} at ${job.company}`,
      text: `${formatRange(job.start, job.end)} (${formatDuration(job.start, job.end)})${job.location ? `, ${job.location}` : ''}. ${job.highlights.join(' ')}`,
      link: '/experience',
      keywords: 'experience work job internship intern role worked company',
    })),
    ...projects.map(project => ({
      title: `Project: ${project.title}`,
      text: `${project.summary} Role: ${project.role}. Built with ${project.tools.join(', ')}. Results: ${project.metrics.map(metric => `${metric.value} ${metric.label}`).join(', ')}. ${project.caseStudy.problem}`,
      link: `/work/${project.slug}`,
      keywords: `project projects built build made ${project.tags.join(' ')} ${project.tools.join(' ')}`,
    })),
    {
      title: 'Hobby projects (Roblox)',
      text: `${hobbyProjects.intro} Featured game: ${hobbyProjects.featured.title} (${hobbyProjects.featured.genre}, ${hobbyProjects.featured.role}). Systems built: ${hobbyProjects.systems.map(system => system.title).join(', ')}.`,
      link: '/hobby-projects',
      keywords: 'hobby hobbies fun free time roblox games game animation animator luau scripting',
    },
    ...milestones.map(milestone => ({
      title: milestone.title,
      text: milestone.text,
      link: '/experience',
      keywords: 'milestone achievement award timeline',
    })),
  ]
}

/** All knowledge as plain text for the AI's instructions. */
export function knowledgeText() {
  return knowledgeDocs().map(doc => `## ${doc.title}\n${doc.text}${doc.link ? `\n(Page: ${doc.link})` : ''}`).join('\n\n')
}
