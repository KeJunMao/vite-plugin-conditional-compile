import MagicString from "magic-string";
import { createFilter, ResolvedConfig } from "vite";
import { ResolvedOptions } from "./types";

export class Context {
  env!: Record<string, any>;
  blockRegex: RegExp;
  filter: any;
  constructor(public options: ResolvedOptions) {
    this.blockRegex =
      /^.*?#v-if(n?)def\s*(\S+).*[\r\n]{1,2}([\s\S]+?)\s*.*?#v-endif.*?$/gm;
    this.filter = createFilter(this.options.include, this.options.exclude);
  }

  setEnv(config: ResolvedConfig) {
    this.env = config.env;
  }

  transform(code: string, id: string) {
    if (!this.filter(id)) return;
    const source = this.createSource(code, id);
    source.replace(this.blockRegex, this.blockReplaceHandler.bind(this));

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
  }
  blockReplaceHandler(_: string, ...args: any[]) {
    const {
      isNot: startNot,
      conditional,
      code,
    } = this.parseBlockReplaceHandlerParams(args);
    const conditionals = this.parseConditional(conditional);
    const isKeep = conditionals.some((subConditional) => {
      const isNot = startNot !== subConditional.isNot;
      if (subConditional.value === undefined) {
        return !!this.env[subConditional.key] !== isNot;
      } else {
        return (
          (String(this.env[subConditional.key]) === subConditional.value) !==
          isNot
        );
      }
    });
    return isKeep ? code : "";
  }
  parseBlockReplaceHandlerParams([$1, $2, $3]: string[]) {
    return {
      isNot: !!$1,
      conditional: $2,
      code: $3,
    };
  }
  parseConditional(conditional: string) {
    return conditional.split("||").map((subConditional) => {
      // @ts-expect-error
      const [_, startNot, key, isNot, value] = subConditional.match(
        /^(!?)(\S+?)(?:(!?)(?:=)(\S+))?$/
      );
      return {
        key,
        isNot: !!startNot !== !!isNot,
        value,
      };
    });
  }
  createSource(code: string, id: string) {
    return new MagicString(code, {
      filename: id,
    });
  }
}
