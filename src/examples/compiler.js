import Lexer from '../lexer/index'
import Parser from '../parser/index'
import SourceToSourceCompiler from '../semantic/SourceToSourceCompiler'

export default function compiler (text) {
  let lexer = new Lexer(text)
  let parser = new Parser(lexer)
  let compiler = new SourceToSourceCompiler(parser)
  return compiler.compile()
}
