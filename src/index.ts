import type { Plugin } from "vite";
import { UserOptions } from "./types";
import { createContext } from "./context";
import remapping from '@ampproject/remapping'

const VitePluginConditionalCompile = (userOptions: UserOptions = {}): Plugin => {
  const ctx = createContext(userOptions);
  return {
    name: "vite-plugin-conditional-compile",
    enforce: "pre",
    configResolved(config) {
      ctx.env = { ...ctx.env, ...config.env }
    },
    transform(code, id) {
      if (ctx.filter(id)) {
        const transformed = ctx.transformWithMap(code, id)
        if (transformed) {
          const map = remapping(
            [this.getCombinedSourcemap() as any, transformed.map],
            () => null,
          ) as any
          return {
            code: transformed.code,
            map,
          }
        }
      }
    },
  }
}

export default VitePluginConditionalCompile;
