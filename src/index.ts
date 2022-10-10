import type { Plugin, ResolvedConfig } from "vite";

let config: ResolvedConfig = undefined!;

const replaceMatched = (code: string, _id: string) => {
  const env = config.env;

  code = code.replace(
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
  return {
    code,
    map: null,
  };
};

const VitePluginConditionalCompile = (): Plugin => {
  return {
    name: "vite-plugin-conditional-compile",
    enforce: "pre",
    configResolved(_config) {
      config = _config;
    },
    transform(code, id) {
      return replaceMatched(code, id);
    },
  };
};

export default VitePluginConditionalCompile;
