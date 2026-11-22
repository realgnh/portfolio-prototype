/**
 * HOBBY PROJECTS — the /hobby-projects page: Roblox games, the systems behind them and an animation reel.
 *
 * - `image`: a file in public/images/hobby/ (e.g. 'my-game.png'). Leave it out for a placeholder.
 * - `video` (reel and clips): a file in public/videos/hobby/ (MP4/WebM, muted). Leave it out for a placeholder.
 * - Numbers are placeholders. Replace them with real figures from Roblox Creator Dashboard.
 *
 * PLACEHOLDERS: every game, number and system below is an example.
 */
export type Game = {
  title: string
  genre: string
  role: string
  summary: string
  stats: { value: string; label: string }[]
  tags: string[]
  url?: string
  image?: string
}

export type System = { title: string; summary: string; tags: string[] }

export const hobbyProjects = {
  intro: 'I build and animate Roblox games in Luau. They’re where I learned to ship to real players, read the analytics and fix things live.',

  featured: {
    title: 'Placeholder Arena',
    genre: 'Multiplayer combat',
    role: 'Lead scripter & animator',
    summary: 'A round-based arena game with server-authoritative combat, custom animations for every move and a progression system that kept players coming back.',
    stats: [
      { value: '1.2M', label: 'visits' },
      { value: '4.8K', label: 'favourites' },
      { value: '92%', label: 'like ratio' },
    ],
    tags: ['Luau', 'Roblox Studio', 'Combat systems', 'Animation'],
    url: 'https://www.roblox.com/',
  } as Game,

  games: [
    {
      title: 'Placeholder Obby',
      genre: 'Platformer',
      role: 'Solo developer',
      summary: 'A 60-stage obstacle course with checkpoints saved to DataStores and a speedrun leaderboard.',
      stats: [{ value: '310K', label: 'visits' }],
      tags: ['Luau', 'DataStores', 'Leaderboards'],
    },
    {
      title: 'Placeholder Tycoon',
      genre: 'Simulation',
      role: 'Scripter',
      summary: 'Economy balancing, purchase handling and an upgrade tree, tuned with analytics from live players.',
      stats: [{ value: '85K', label: 'visits' }],
      tags: ['Luau', 'Economy design', 'Analytics'],
    },
  ] as Game[],

  systems: [
    { title: 'Server-authoritative combat', summary: 'Clients request attacks; the server validates range, cooldowns and hitboxes before applying damage, so exploiters can’t one-shot players.', tags: ['Luau', 'Networking', 'Anti-cheat'] },
    { title: 'Versioned DataStore saves', summary: 'Player data saved with retries, session locking and schema versions, so a crash or an update never wipes progress.', tags: ['Luau', 'DataStores', 'Reliability'] },
    { title: 'Matchmaking queue', summary: 'A queue that groups players by skill and region, then teleports full lobbies to reserved servers.', tags: ['Luau', 'MessagingService', 'TeleportService'] },
    { title: 'Animation event pipeline', summary: 'Animation markers drive hit frames, sounds and VFX, so timing lives in the animation instead of in hard-coded waits.', tags: ['Animation', 'Luau', 'Tooling'] },
  ] as System[],

  reel: {
    title: 'Animation reel',
    summary: 'Combat, emotes and cutscenes animated in Roblox Studio and Blender.',
    // video: 'reel.mp4',
    video: undefined as string | undefined,
  },
}
