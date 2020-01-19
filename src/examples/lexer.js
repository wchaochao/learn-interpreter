import Lexer from '../lexer/index'

export default function lexer (text) {
  const lexer = new Lexer(text)
  return lexer.output()
}
