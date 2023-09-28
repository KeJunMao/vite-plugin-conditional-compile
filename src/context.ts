import { Context } from "unplugin-preprocessor-directives"
import { UserOptions } from "./types"
import { resolveOptions } from "./options"

export function createContext(options: UserOptions = {}) {
  return new Context(resolveOptions(options))
}
