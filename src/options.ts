import { ResolvedOptions, UserOptions } from "./types";
import { IfStatement, IfToken, SimpleNode, SimpleToken, defineDirective, resolveConditional, simpleMatchToken } from 'unplugin-preprocessor-directives'

interface VIfToken extends SimpleToken {
  type: 'ifdef' | 'else' | 'elif' | 'endif';
  value: string;
}

interface VIfStatement extends SimpleNode {
  type: 'IfStatement';
  test: string;
  consequent: SimpleNode[];
  alternate: SimpleNode[];
  kind: VIfToken['type'];
}

const vIfDirective = defineDirective<VIfToken, VIfStatement>((context) => {
  return {
    lex(comment) {
      return simpleMatchToken(comment ?? '', /#v-(ifdef|else|elif|endif)\s?(.*)/)
    },
    parse(token) {
      if (token.type === 'ifdef' || token.type === 'elif' || token.type === 'else') {
        const node: VIfStatement = {
          type: 'IfStatement',
          test: token.value,
          consequent: [],
          alternate: [],
          kind: token.type,
        }
        this.current++

        while (this.current < this.tokens.length) {
          const nextToken = this.tokens[this.current]

          if (nextToken.type === 'elif' || nextToken.type === 'else') {
            node.alternate.push(this.walk())
            break
          }
          else if (nextToken.type === 'endif') {
            this.current++ // Skip 'endif'
            break
          }
          else {
            node.consequent.push(this.walk())
          }
        }
        return node
      }
    },
    transform(node) {
      if (node.type === 'IfStatement') {
        if (resolveConditional(node.test, context.env)) {
          return {
            type: 'Program',
            body: node.consequent.map(this.walk.bind(this)).filter(n => n != null),
          }
        }
        else if (node.alternate) {
          return {
            type: 'Program',
            body: node.alternate.map(this.walk.bind(this)).filter(n => n != null),
          }
        }
      }
    },
    generate(node, comment) {
      if (node.type === 'IfStatement' && comment) {
        let code = ''
        if (node.kind === 'else')
          code = `${comment.start} ${node.kind} ${comment.end}`

        else
          code = `${comment.start} #${node.kind} ${node.test}${comment.end}`

        const consequentCode = node.consequent.map(this.walk.bind(this)).join('\n')
        code += `\n${consequentCode}`
        if (node.alternate.length) {
          const alternateCode = node.alternate.map(this.walk.bind(this)).join('\n')
          code += `\n${alternateCode}`
        }
        else {
          code += `\n${comment.start} #endif ${comment.end}`
        }
        return code
      }
    },
  }
})



export const resolveOptions = (userOptions?: UserOptions): ResolvedOptions => {
  return {
    include: ["**/*"],
    exclude: [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/],
    ...userOptions,
    directives: [
      // @ts-expect-error ignore
      vIfDirective
    ]
  };
};
