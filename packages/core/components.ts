import * as components from '@vue-omap/components'
export * from '@vue-omap/components'
import type { Plugin } from 'vue'
const plugin: Plugin = {
  install(app, config?: Record<string, string>) {
    for (const key in components) {
      const name = key as keyof typeof components
      if (Object.prototype.hasOwnProperty.call(components, key)) {
        components[name].install?.(app)
      }
    }
    if (config) {
      for (const key in config) {
        app.provide(key, config[key])
      }
    }
  }
}
export default plugin
