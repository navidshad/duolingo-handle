import { GlobalOptions } from '@modular-rest/client'

GlobalOptions.set({
  host: import.meta.env.VITE_APP_BASE_URL as string
})
