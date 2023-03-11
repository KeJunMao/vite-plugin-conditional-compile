import type { Plugin } from "vite";
import { UserOptions } from "./types";
import { Context } from "./context";
import { resolveOptions } from "./options";

const VitePluginConditionalCompile = (
  userOptions: UserOptions = {}
): Plugin => {
  const options = resolveOptions(userOptions);
  const ctx = new Context(options);
  return {
    name: "vite-plugin-conditional-compile",
    enforce: "pre",
    configResolved(_config) {
      ctx.setEnv(_config.env);
    },
    transform: (code, id) => ctx.transform(code, id),
  };
};

export default VitePluginConditionalCompile;
