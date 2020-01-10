import text from './text'
import Lexer from '../lexer/index'
import Parser from '../parser/index'
import Interpreter from '../interpreter/index'

export default function interpreter (text) {
  let lexer = new Lexer(text)
  let parser = new Parser(lexer)
  let interpreter = new Interpreter(parser)
  interpreter.interprete()
  return JSON.stringify(interpreter.GLOBAL_SCOPE, null, '|-')
}
