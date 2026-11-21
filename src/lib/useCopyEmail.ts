import { profile } from '../content/profile'
import { sections } from '../content/sections'
import { useToast } from './toast'

/** Returns a function that copies your email and shows a confirmation toast. */
export function useCopyEmail() {
  const toast = useToast()
  return async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      toast(sections.toast.copied)
    } catch {
      toast(sections.toast.failed)
    }
  }
}
