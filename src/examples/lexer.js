import Lexer from '../lexer/index'

export default function lexer (text) {
  let lexer = new Lexer(text)
  let token
  let result = []
  do {
    token = lexer.getNextToken()
    result.push(token.toString())
  } while (token.value !== null)
  return result.join('\n')
}
