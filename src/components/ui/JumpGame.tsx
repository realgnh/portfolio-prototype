import { useCallback, useRef } from 'react'
import { sections } from '../../content/sections'
import { skills } from '../../content/skills'
import { useJumpGame } from '../../lib/useJumpGame'
import { BrandIcon } from './BrandIcon'

/** Where the cube stands on the 404 track (0–1). */
const CUBE_AT = 0.18

/**
 * Endless version of the loading-screen jump game, used on the 404 page.
 * Space / ↑ / tap to jump; bumping a block ends the round, jump again to restart.
 * Engine: lib/useJumpGame.ts. Styles: "Jump game" in layout.css and .jump-stage in pages.css.
 */
export function JumpGame() {
  const track = useRef<HTMLDivElement>(null)
  const lane = useRef<HTMLDivElement>(null)
  const icons = useRef(skills.filter(skill => skill.icon)).current
  const cubeAt = useCallback(() => CUBE_AT, [])
  const game = useJumpGame({ mode: 'endless', track, lane, cubeAt })
  const copy = sections.notFound

  return (
    <div className="jump-stage loader" data-over={game.over || undefined} onPointerDown={game.jump} style={{ '--hop': '720ms', '--logos': icons.length } as React.CSSProperties}>
      <div ref={track} className="loader-track jump-track">
        <div ref={lane} className="jump-lane" aria-hidden="true" />
        <div className="jump-cube" style={{ left: `${CUBE_AT * 100}%` }}>
          <div className={`loader-leap${game.jumping ? ' is-leaping' : ''}`}>
            <div className="loader-hop">
              <div className="loader-block">
                <div className="loader-logos-window">
                  <div className="loader-logos">
                    {icons.map(skill => <span key={skill.name}><BrandIcon skill={skill} /></span>)}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="loader-shadow" />
        </div>
        <div className="jump-floor" aria-hidden="true" />
      </div>
      <p className="jump-hint" role="status">
        {game.over
          ? <>{copy.gameOver} <strong>{game.score}</strong> · best {game.best}. {copy.retry}</>
          : game.playing ? <>Cleared <strong>{game.score}</strong> · best {game.best}</> : copy.gameHint}
      </p>
    </div>
  )
}
