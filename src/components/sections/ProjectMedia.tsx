import { useEffect, useRef } from 'react'
import type { Project } from '../../content/projects'
import { sections } from '../../content/sections'
import type { Tone } from '../../content/skills'
import { useMotion } from '../../lib/preferences'
import { ImageSlot } from '../ui/ImageSlot'

/**
 * The big picture on a project's page: a muted looping video if `video` is set,
 * otherwise the screenshot, otherwise a placeholder. With animations off the video stays paused.
 */
export function ProjectMedia({ project, tone }: { project: Project; tone: Tone }) {
  const motion = useMotion()
  const video = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const element = video.current
    if (!element) return
    if (motion === 'on') void element.play().catch(() => {})
    else element.pause()
  }, [motion])

  if (project.video) {
    return (
      <div className="image-slot image-slot-wide project-media" data-tone={tone}>
        <video
          ref={video}
          src={`/videos/projects/${project.video}`}
          poster={project.image ? `/images/projects/${project.image}` : undefined}
          muted
          loop
          playsInline
          autoPlay={motion === 'on'}
          aria-label={project.imageAlt ?? `${project.title} demo`}
        />
      </div>
    )
  }
  return <ImageSlot src={project.image} folder="projects" alt={project.imageAlt ?? `${project.title} screenshot`} label={sections.placeholders.projectMedia} tone={tone} />
}
