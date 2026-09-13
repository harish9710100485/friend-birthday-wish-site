import { basePath } from './site-config'

// Prefixes root-relative local paths (e.g. "/photos/cake.jpg") with the
// configured basePath so they resolve correctly on GitHub Pages. Remote
// URLs and already-prefixed paths pass through untouched.
export function withBasePath(path: string): string
export function withBasePath(path: string | null | undefined): string | null | undefined
export function withBasePath(path: string | null | undefined){
  if (!path) return path
  if (/^https?:\/\//.test(path)) return path
  if (!path.startsWith('/')) return path
  if (basePath && path.startsWith(basePath)) return path
  return `${basePath}${path}`
}
