/**
 * EXPERIENCE — internships and jobs, newest first.
 * Shown on Home (first few), on /experience (all) and on the résumé.
 *
 * - `start` / `end`: 'YYYY-MM' (e.g. '2026-04'). Use end: 'present' for a current role.
 *   The site shows "April 2026 – June 2026" and the length ("3 months") automatically.
 * - `logo`: a file name in public/images/companies/, e.g. 'example-org.svg'.
 *   Square images work best (at least 160×160). Leave it out for a placeholder.
 * - `highlights`: one line each; Home shows the first, the other pages show all.
 *
 * PLACEHOLDERS: replace every company, role and date below.
 */
export type Experience = {
  company: string
  role: string
  start: string
  end: string | 'present'
  location?: string
  logo?: string
  url?: string
  highlights: string[]
}

export const experience: Experience[] = [
  {
    company: 'GIU Lab',
    role: 'Undergraduate research assistant',
    start: '2025-10',
    end: 'present',
    location: 'On campus',
    // logo: 'x-university-lab.svg',
    highlights: [
      'Placeholder for a research or teaching role. Say what you built or measured.',
      'Add a second line with a concrete result, tool or paper.',
    ],
  },
  {
    company: 'Example Organization',
    role: 'Software engineering intern',
    start: '2025-06',
    end: '2025-08',
    location: 'Remote',
    // logo: 'example-organization.svg',
    highlights: [
      'Prototyped an internal tool and documented how to test and maintain it.',
      'Placeholder for a second highlight: what changed because of your work?',
    ],
  },
  {
    company: 'Future Company',
    role: 'AI engineering intern',
    start: '2024-07',
    end: '2024-07',
    // logo: 'future-company.svg',
    highlights: ['Placeholder for a short internship. Add one line about the team or product.'],
  },
]
