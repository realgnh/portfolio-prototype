/**
 * EXPERIENCE — internships and jobs, newest first. Shown on Home and the résumé.
 *
 * - `logo`: a file name in public/images/companies/, e.g. 'example-org.svg'.
 *   Square images work best (at least 160×160). Leave it out for a placeholder.
 * - `highlights`: one line each; the résumé shows them all, Home shows the first.
 *
 * PLACEHOLDERS: replace every company, role and date below.
 */
export type Experience = {
  company: string
  role: string
  period: string
  location?: string
  logo?: string
  url?: string
  highlights: string[]
}

export const experience: Experience[] = [
  {
    company: 'Example Organization',
    role: 'Software engineering intern',
    period: 'Summer 20XX',
    location: 'Remote',
    // logo: 'example-organization.svg',
    highlights: ['Prototyped an internal tool and documented how to test and maintain it.'],
  },
  {
    company: 'Future Company',
    role: 'Incoming AI engineering intern',
    period: 'Summer 20XX',
    // logo: 'future-company.svg',
    highlights: ['Placeholder for an upcoming internship. Add one line about the team or product.'],
  },
  {
    company: 'X University Lab',
    role: 'Undergraduate research assistant',
    period: '20XX – present',
    // logo: 'x-university-lab.svg',
    highlights: ['Placeholder for a research or teaching role. Say what you built or measured.'],
  },
]
