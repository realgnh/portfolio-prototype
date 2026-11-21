import { siLuau, siRoblox, siRobloxstudio } from 'simple-icons'
import type { SimpleIcon } from 'simple-icons'
import type { Tone } from './skills'

/**
 * HOBBIES — the "Outside of class" section on Home.
 * `tone` picks the pastel colour (butter, peach, mint, lilac, sky, rose).
 * `icons` are brand logos from simple-icons (https://simpleicons.org).
 */
export type Hobby = {
  title: string
  description: string
  tone: Tone
  icons: SimpleIcon[]
  tags: string[]
}

export const hobbies: Hobby[] = [
  {
    title: 'Roblox animator',
    description: 'Experienced animator for Roblox games: character rigs, combat and emote animations, and cutscenes that feel good to play.',
    tone: 'rose',
    icons: [siRoblox, siRobloxstudio],
    tags: ['Rigging', 'Combat animation', 'Cutscenes'],
  },
  {
    title: 'Roblox game developer',
    description: 'Building and scripting Roblox games in Luau, from gameplay systems and UI to data saving and live updates.',
    tone: 'sky',
    icons: [siLuau, siRobloxstudio],
    tags: ['Luau', 'Gameplay systems', 'UI'],
  },
]
