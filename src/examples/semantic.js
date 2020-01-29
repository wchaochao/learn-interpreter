import Lexer from '../lexer/index'
import Parser from '../parser/index'
import Semantic from '../semantic/index'

export default function semantic (text) {
  let lexer = new Lexer(text)
  let parser = new Parser(lexer)
  let semantic = new Semantic(parser.parse(), true)
  semantic.analyze()
  return semantic.output.reverse().join('\n\n')
}
