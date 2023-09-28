import type { Plugin } from "vite";
import { UserOptions } from "./types";
import { createContext } from "./context";

const VitePluginConditionalCompile = (userOptions: UserOptions = {}): Plugin => {
  const ctx = createContext(userOptions);
  return {
    name: "vite-plugin-conditional-compile",
    enforce: "pre",
    configResolved(config) {
      ctx.env = { ...ctx.env, ...config.env }
    },
    transform: (code, id) => ctx.transform(code, id),
  }
}

export default VitePluginConditionalCompile;
