import text from './text'
import Lexer from '../lexer/index'
import Parser from '../parser/index'

let lexer = new Lexer(text)
let parser = new Parser(lexer)
console.log(JSON.stringify(parser.parse(), null, '|-'))
