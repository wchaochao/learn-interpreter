import text from './text'
import Lexer from '../lexer/index'

let lexer = new Lexer(text)
do {
  let token = lexer.getNextToken()
  if (token.value !== null) {
    console.log(token)
  } else {
    break
  }
} while (true)
