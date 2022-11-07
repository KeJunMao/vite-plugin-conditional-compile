import type { Plugin, ResolvedConfig } from "vite";
import MagicString from "magic-string";
import { createFilter } from "vite";
import { ResolvedOptions, UserOptions } from "./types";
let config: ResolvedConfig = undefined!;

const replaceMatched = (code: string, id: string) => {
  const env = config.env;
  const source = new MagicString(code, {
    filename: id,
  });

  source.replace(
    /^.*?#v-if(n?)def\s*(\S+).*[\r\n]{1,2}([\s\S]+?)\s*.*?#v-endif.*?$/gm,
    /**
     * 条件替换
     * @param _ 匹配的字符串
     * @param $1 是否为 not 模式
     * @param $2 条件
     * @param $3 code
     */
    (_, $1, $2, $3) => {
      const isNot = !!$1;
      const isKeep = $2.split("||").some((v: string) => {
        let flag = false;
        const [key, value] = v.split("=");
        if (value === undefined) {
          flag = !!env[key];
        } else {
          flag = String(env[key]) === value;
        }
        flag = isNot ? !flag : flag;
        return flag;
      });
      return isKeep ? $3 : "";
    }
  );

  if (source.hasChanged()) {
    return {
      code: source.toString(),
      map: source.generateMap({
        source: id,
        file: `${id}.map`,
        includeContent: true,
      }),
    };
  }
};

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
  return {
    name: "vite-plugin-conditional-compile",
    enforce: "pre",
    configResolved(_config) {
      config = _config;
    },
    transform(code, id) {
      const filter = createFilter(options.include, options.exclude);
      if (filter(id)) {
        return replaceMatched(code, id);
      }
    },
  };
};

export default VitePluginConditionalCompile;
