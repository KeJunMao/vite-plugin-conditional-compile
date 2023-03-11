import { ResolvedOptions, UserOptions } from "./types";

export const resolveOptions = (userOptions?: UserOptions): ResolvedOptions => {
  return {
    include: ["**/*"],
    exclude: [],
    ...userOptions,
  };
};
