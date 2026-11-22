/**
 * The little jump game (loading screen + 404 page): blocks slide in from the right and
 * the player presses Space / ↑ / taps to make the cube leap over them.
 *
 * Nothing moves until the first jump, so ignoring it changes nothing.
 * Blocks are plain DOM nodes moved with transforms each frame (no React re-render per frame).
 *  - mode 'loader': runs until the loading screen ends; bumping a block just resets the streak.
 *  - mode 'endless': bumping a block ends the round; jump again to restart.
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import { motionAllowed } from './preferences'

const BEST_KEY = 'portfolio-jump-best'
/** How long one jump lasts (ms). Keep in sync with the `leap` animation in layout.css. */
export const JUMP_MS = 560
/** Track widths per second the blocks travel. */
const SPEED = 0.42
/** Time between blocks (ms), randomised within this range. */
const GAP: [number, number] = [650, 1150]
const BLOCK = 12 // block width in px
const CUBE = 40 // cube width in px

type Block = { x: number; node: HTMLElement; done: boolean }

export function readBest() {
  try { return Number(localStorage.getItem(BEST_KEY)) || 0 } catch { return 0 }
}

export function useJumpGame(options: {
  mode: 'loader' | 'endless'
  track: React.RefObject<HTMLElement | null>
  lane: React.RefObject<HTMLElement | null>
  /** Where the cube is along the track, 0–1. */
  cubeAt: () => number
  active?: boolean
}) {
  const { mode, track, lane, cubeAt, active = true } = options
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(readBest)
  const [playing, setPlaying] = useState(false)
  const [over, setOver] = useState(false)
  const [jumping, setJumping] = useState(false)
  const state = useRef({ jumpUntil: 0, nextBlock: 0, blocks: [] as Block[], score: 0, over: false, playing: false })

  const clearBlocks = useCallback(() => {
    for (const block of state.current.blocks) block.node.remove()
    state.current.blocks = []
  }, [])

  const jump = useCallback(() => {
    const game = state.current
    const now = performance.now()
    if (game.over) {
      clearBlocks()
      game.over = false
      game.score = 0
      setOver(false)
      setScore(0)
    }
    if (!game.playing) {
      game.playing = true
      game.nextBlock = now + 250
      setPlaying(true)
    }
    if (now < game.jumpUntil) return
    game.jumpUntil = now + JUMP_MS
    setJumping(false)
    requestAnimationFrame(() => setJumping(true)) // restart the CSS leap
  }, [clearBlocks])

  // Space / ↑ / W to jump.
  useEffect(() => {
    if (!active) return
    function onKey(event: KeyboardEvent) {
      if (event.target instanceof HTMLElement && /^(INPUT|TEXTAREA|SELECT|BUTTON|A)$/.test(event.target.tagName) && event.key !== ' ') return
      if (event.key === ' ' || event.key === 'ArrowUp' || event.key === 'w') {
        event.preventDefault()
        jump()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, jump])

  // Game loop: spawn, move and check blocks.
  useEffect(() => {
    if (!active || !playing) return
    let frame = 0
    let last = performance.now()
    function tick(now: number) {
      const game = state.current
      const width = track.current?.clientWidth ?? 0
      const dt = Math.min(now - last, 50)
      last = now
      if (!game.over && width && lane.current) {
        if (now >= game.nextBlock) {
          const node = document.createElement('span')
          node.className = 'jump-block'
          lane.current.appendChild(node)
          game.blocks.push({ x: width + BLOCK, node, done: false })
          game.nextBlock = now + GAP[0] + Math.random() * (GAP[1] - GAP[0])
        }
        const cubeX = cubeAt() * width
        const airborne = now < game.jumpUntil
        for (const block of game.blocks) {
          block.x -= width * SPEED * (dt / 1000)
          block.node.style.transform = `translateX(${block.x}px)`
          const overlapping = Math.abs(block.x + BLOCK / 2 - cubeX) < (CUBE + BLOCK) / 2 - 4
          if (!block.done && overlapping && !airborne) {
            block.done = true
            block.node.dataset.hit = ''
            if (mode === 'endless') {
              game.over = true
              setOver(true)
            }
            game.score = mode === 'endless' ? game.score : 0
            setScore(game.score)
          } else if (!block.done && block.x + BLOCK < cubeX - CUBE / 2) {
            block.done = true
            game.score += 1
            setScore(game.score)
            if (game.score > readBest()) {
              try { localStorage.setItem(BEST_KEY, String(game.score)) } catch { /* ignore */ }
              setBest(game.score)
            }
          }
        }
        game.blocks = game.blocks.filter(block => {
          if (block.x > -BLOCK * 2) return true
          block.node.remove()
          return false
        })
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [active, playing, mode, track, lane, cubeAt])

  useEffect(() => () => clearBlocks(), [clearBlocks])

  return { score, best, playing, over, jumping, jump, animated: motionAllowed() }
}
