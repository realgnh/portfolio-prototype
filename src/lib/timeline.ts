/**
 * Builds the Experience timeline from three content files:
 * experience.ts (roles), projects.ts (projects) and milestones.ts (everything else).
 * Entries are sorted newest first by their start date.
 */
import { experience } from '../content/experience'
import { milestones } from '../content/milestones'
import { projects } from '../content/projects'
import { formatDuration, formatMonth, formatRange } from './dates'

export type TimelineEntry =
  | { kind: 'role'; key: string; sortDate: string; title: string; subtitle: string; when: string; length: string; text: string[]; logo?: string; company: string }
  | { kind: 'project'; key: string; sortDate: string; title: string; subtitle: string; when: string; text: string[]; slug: string }
  | { kind: 'milestone'; key: string; sortDate: string; title: string; when: string; text: string[]; emoji: string }

/** Turns 'present' into a sortable value. */
function sortable(date: string) {
  return date === 'present' ? '9999-12' : date
}

export function buildTimeline(): TimelineEntry[] {
  const entries: TimelineEntry[] = [
    ...experience.map(job => ({
      kind: 'role' as const,
      key: `role-${job.company}-${job.role}`,
      sortDate: sortable(job.end === 'present' ? 'present' : job.start),
      title: job.role,
      subtitle: job.company + (job.location ? ` · ${job.location}` : ''),
      when: formatRange(job.start, job.end),
      length: formatDuration(job.start, job.end),
      text: job.highlights,
      logo: job.logo,
      company: job.company,
    })),
    ...projects.map(project => ({
      kind: 'project' as const,
      key: `project-${project.slug}`,
      sortDate: project.date,
      title: project.title,
      subtitle: project.tags.join(' · '),
      when: formatMonth(project.date),
      text: [project.summary],
      slug: project.slug,
    })),
    ...milestones.map(milestone => ({
      kind: 'milestone' as const,
      key: `milestone-${milestone.date}-${milestone.title}`,
      sortDate: milestone.date,
      title: milestone.title,
      when: formatMonth(milestone.date),
      text: [milestone.text],
      emoji: milestone.emoji,
    })),
  ]
  return entries.sort((a, b) => b.sortDate.localeCompare(a.sortDate))
}
