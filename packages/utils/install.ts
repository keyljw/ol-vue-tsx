import type { App, Plugin } from 'vue'

type Record<K extends keyof any, T> = { [P in K]: T }
type PluginInstall<T> = T & Plugin

export const pluginInstall = <T, E extends Record<string, any>>(main: T, extra?: E) => {
  const target = main as PluginInstall<T>
  const plugins = [main, ...Object.values(extra ?? {})]

  target.install = (app: App): void => {
    for (const comp of plugins) {
      app.component(comp.name, comp)
    }
  }

  if (extra) {
    const entries = Object.entries(extra)
    for (const [key, comp] of entries) {
      ;(main as any)[key] = comp
    }
  }

  return main as PluginInstall<T> & E
}
