/**
 * MILESTONES — moments that aren't a job or a project, shown on the Experience timeline
 * alongside your roles and projects (newest first is automatic).
 *
 * - `date`: 'YYYY-MM'
 *
 * PLACEHOLDERS: replace with your own.
 */
export type Milestone = { date: string; title: string; text: string }

export const milestones: Milestone[] = [
  { date: '2024-09', title: 'Started B.Sc. Computer Science', text: 'Began studying at German International University (GIU).' },
  { date: '2023-06', title: 'Published my first Roblox game', text: 'Placeholder: say how many people played it or what you learned.' },
  { date: '2025-12', title: 'Placeholder award or hackathon', text: 'Add a competition, certificate or talk here.' },
]
