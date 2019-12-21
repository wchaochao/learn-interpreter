import text from './text'
import Lexer from '../lexer/index'

let lexer = new Lexer(text)
let token
do {
  token = lexer.getNextToken()
  console.log(token)
} while (token.value !== null)
