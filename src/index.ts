import type { Plugin } from "vite";
import { ResolvedOptions, UserOptions } from "./types";
import { Context } from "./context";

const resolveOptions = (userOptions: UserOptions): ResolvedOptions => {
  return {
    include: ["**/*"],
    exclude: [],
    ...userOptions,
  };
};

const VitePluginConditionalCompile = (
  userOptions: UserOptions = {}
): Plugin => {
  const options = resolveOptions(userOptions);
  const ctx = new Context(options);
  return {
    name: "vite-plugin-conditional-compile",
    enforce: "pre",
    configResolved(_config) {
      ctx.setEnv(_config);
    },
    transform: (code, id) => ctx.transform(code, id),
  };
};

export default VitePluginConditionalCompile;
