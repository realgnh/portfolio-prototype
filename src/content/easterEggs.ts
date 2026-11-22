/**
 * EASTER EGG — a little blocky character drops in and waves, and from then on the
 * loading screen's cube turns into a red brick. Edit the triggers and wording here.
 *
 * Any one trigger works:
 * - typing `secretWord` anywhere on the page (not inside a text box),
 * - pressing the `arrowCode` keys in order,
 * - clicking the "AK." logo `logoClicks` times quickly.
 */
export const easterEgg = {
  secretWord: 'roblox',
  arrowCode: ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown'],
  logoClicks: 5,

  /** Small hint in the footer. Set to '' to hide it. */
  hint: 'Psst… type “roblox” anywhere, or tap the AK. logo 5 times.',
  speech: 'Hey! You found the secret.',
  /** How long the character stays (milliseconds). */
  stay: 6000,
  /** Toast shown the first time, about the loading-screen brick. */
  brickUnlocked: 'Brick mode unlocked: refresh to see the loading screen.',
}
