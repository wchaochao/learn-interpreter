import Lexer from '../lexer/index'
import Parser from '../parser/index'
import Semantic from '../semantic/index'

export default function semantic (text) {
  let lexer = new Lexer(text)
  let parser = new Parser(lexer)
  let tree = parser.parse()
  let semantic = new Semantic()
  semantic.visit(tree)
  return JSON.stringify(semantic.symtab.toString(), null, '|-')
}
