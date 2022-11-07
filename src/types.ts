import type { FilterPattern } from "vite";

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

export type ResolvedOptions = Options;
