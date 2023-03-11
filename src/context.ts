import MagicString from "magic-string";
import { createFilter, createLogger, Logger } from "vite";
import { ResolvedOptions } from "./types";

export class Context {
  env!: Record<string, any>;
  blockRegex: RegExp;
  filter: any;
  logger: Logger;
  constructor(public options: ResolvedOptions) {
    this.blockRegex =
      /^.*?#v-if(n?)def\s*(\S+).*[\r\n]{1,2}([\s\S]+?)\s*.*?#v-endif.*?$/gm;
    this.filter = createFilter(this.options.include, this.options.exclude);
    this.logger = createLogger("info", {
      prefix: "[vite-plugin-conditional-compile]",
    });
  }

  setEnv(env: Record<string, any>) {
    this.env = env;
  }

  transform(code: string, id: string) {
    try {
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
    } catch (error: any) {
      this.logger.error(error, {
        timestamp: true,
      });
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
      const value = this.env[subConditional.key];
      if (!Object.hasOwn(this.env, subConditional.key)) {
        this.logger.warn(
          `No '${subConditional.key}' propertie in Vite environment variables`,
          {
            timestamp: true,
          }
        );
      }
      if (subConditional.value === undefined) {
        return !!value !== isNot;
      } else {
        return (String(value) === subConditional.value) !== isNot;
      }
    });
    const { ifCode, elseCode } = this.parseElse(code);
    return isKeep ? ifCode : elseCode;
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

  parseElse(code: string) {
    const [_, ifCode, elseCode] = code?.match(
      /^([\s\S]*?).*#v-else.*[\r\n]{1,2}([\s\S]*)$/
    ) ?? [code, "", ""];
    return {
      ifCode: ifCode ? ifCode : code,
      elseCode: elseCode ? elseCode : "",
    };
  }

  createSource(code: string, id: string) {
    return new MagicString(code, {
      filename: id,
    });
  }
}
