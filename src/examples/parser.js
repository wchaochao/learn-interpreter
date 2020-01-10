import Lexer from '../lexer/index'
import Parser from '../parser/index'

export default function parser (text) {
  let lexer = new Lexer(text)
  let parser = new Parser(lexer)
  return JSON.stringify(parser.parse(), null, '|-')
}
