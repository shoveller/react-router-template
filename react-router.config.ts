import type { Config } from '@react-router/dev/config'

export const prerender = ['/']

export default {
  // Config options...
  // Server-side render by default, to enable SPA mode set this to `false`
  ssr: false,
  prerender
} satisfies Config
