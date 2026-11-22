/**
 * Offline answers for "Ask my portfolio": finds the content that best matches the question.
 * Used when the AI isn't available (local development, or before Workers AI is switched on).
 */
import { profile } from '../content/profile'
import { intentAnswer } from './chatAnswers'
import { knowledgeDocs } from './knowledge'

const stopWords = new Set('a an and are as at be can do does for from has have how i in is it me my of on or so tell the to what when where which who why with you your his her their alex abdalla'.split(' '))

function words(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9+#.\s]/g, ' ').split(/\s+/).filter(word => word.length > 1 && !stopWords.has(word))
}

export function localAnswer(question: string): { text: string; link?: string } {
  // Common questions have ready-made answers (lib/chatAnswers.ts).
  const ready = intentAnswer(question)
  if (ready) return ready
  const asked = words(question)
  const docs = knowledgeDocs()
  const matches = (terms: string[], word: string) => terms.some(term => term === word || (word.length > 3 && (term.startsWith(word) || word.startsWith(term))))
  // Topic keywords count most, then titles, then the text itself.
  const scored = docs.map(doc => {
    const keywords = words(doc.keywords)
    const title = words(doc.title)
    const body = words(doc.text)
    const score = asked.reduce((sum, word) => sum + (matches(keywords, word) ? 3 : 0) + (matches(title, word) ? 2 : 0) + (matches(body, word) ? 1 : 0), 0)
    return { doc, score }
  }).sort((a, b) => b.score - a.score)

  const best = scored[0]
  if (!best || best.score === 0) {
    return { text: `I can tell you about ${profile.firstName}'s projects, skills, experience, hobbies or how to get in touch. Try one of the suggestions below.` }
  }
  const firstSentences = best.doc.text.split(/(?<=[.)])\s/).slice(0, 4).join(' ')
  return { text: `${best.doc.title}: ${firstSentences}`, link: best.doc.link }
}
