import text from './text'
import Lexer from '../lexer/index'
import Parser from '../parser/index'
import Semantic from '../semantic/index'

let lexer = new Lexer(text)
let parser = new Parser(lexer)
let tree = parser.parse()
let semantic = new Semantic()
semantic.visit(tree)
console.log(JSON.stringify(semantic.symtab.toString(), null, '|-'))
