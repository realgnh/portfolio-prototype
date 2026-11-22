/**
 * Visitor greeting for the Contact page: "Good evening!" from the visitor's own clock,
 * plus how far ahead or behind your time zone (profile.timeZone) is.
 */

/** Minutes a time zone is ahead of UTC at a given moment (handles daylight saving). */
function offsetMinutes(timeZone: string | undefined, at: Date) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
  }).formatToParts(at)
  const get = (type: string) => Number(parts.find(part => part.type === type)?.value)
  const asUtc = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'))
  return Math.round((asUtc - Math.floor(at.getTime() / 60000) * 60000) / 60000)
}

/** 'Good morning' / 'Good afternoon' / 'Good evening' / 'Hey, night owl' for a 0–23 hour. */
export function greetingFor(hour: number) {
  if (hour >= 5 && hour < 12) return 'Good morning!'
  if (hour >= 12 && hour < 17) return 'Good afternoon!'
  if (hour >= 17 && hour < 22) return 'Good evening!'
  return 'Hey, night owl!'
}

/** "It's 3 hours later for me" / "It's 1 hour 30 minutes earlier for me" / "We're in the same time zone". */
export function differenceFrom(myTimeZone: string, at = new Date(), visitorTimeZone?: string) {
  const diff = offsetMinutes(myTimeZone, at) - offsetMinutes(visitorTimeZone, at)
  if (diff === 0) return 'We’re in the same time zone.'
  const total = Math.abs(diff)
  const hours = Math.floor(total / 60)
  const minutes = total % 60
  const parts = []
  if (hours) parts.push(`${hours} ${hours === 1 ? 'hour' : 'hours'}`)
  if (minutes) parts.push(`${minutes} minutes`)
  return `It’s ${parts.join(' ')} ${diff > 0 ? 'later' : 'earlier'} for me.`
}
