import { ResolvedOptions, UserOptions } from "./types";
import { defineDirective } from 'unplugin-preprocessor-directives'

export function resolveConditional(test: string, env = process.env) {
  test = test || 'true'
  test = test.trim()
  test = test.replace(/([^=!])=([^=])/g, '$1==$2')
  // eslint-disable-next-line no-new-func
  const evaluateCondition = new Function('env', `with (env){ return ( ${test} ) }`)

  try {
    return evaluateCondition(env)
  }
  catch (error) {
    if (error instanceof ReferenceError) {
      const match = /(\w*?) is not defined/g.exec(error.message)
      if (match && match[1]) {
        const name = match[1]
        // @ts-expect-error ignore
        env[name] = false
        return resolveConditional(test, env)
      }
    }
    return false
  }
}

const vIfDefine = defineDirective<undefined>(() => ({
  name: '#v-ifdef',
  nested: true,
  pattern: {
    start: /.*?#v-ifdef\s([\w !=&|()'"]*).*[\r\n]{1,2}/gm,
    end: /\s*.*?#v-endif.*?$/gm,
  },
  processor({ matchGroup, replace, ctx }) {
    const code = replace(matchGroup.match)
    const regex = /.*?(#v-el(?:if|se))\s?([\w !=&|()'"]*).*[\r\n]{1,2}/gm
    const codeBlock = [
      '#v-ifdef',
      matchGroup.left?.[1] || '',
      ...ctx.XRegExp.split(code, regex),
    ].map(v => v.trim())

    while (codeBlock.length) {
      const [variant, conditional, block] = codeBlock.splice(0, 3)
      if (variant === '#v-ifdef' || variant === '#v-elif') {
        if (resolveConditional(conditional, ctx.env))
          return block
      }
      else if (variant === '#v-else') {
        return block
      }
    }
    return ''
  },
}))


export const resolveOptions = (userOptions?: UserOptions): ResolvedOptions => {
  return {
    include: ["**/*"],
    exclude: [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/],
    ...userOptions,
    directives: [
      vIfDefine()
    ]
  };
};
