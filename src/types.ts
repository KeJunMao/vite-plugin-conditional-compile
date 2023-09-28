import type { FilterPattern } from "vite";
import { Directive, FunctionDirective } from 'unplugin-preprocessor-directives'

export interface Options {
  /**
   * @default ["**\/*"]
   */
  include: FilterPattern;
  /**
   * @default []
   */
  exclude: FilterPattern;
}

export type UserOptions = Partial<Options>;

export interface ResolvedOptions extends Options {
  directives: (Directive | FunctionDirective)[];
}
