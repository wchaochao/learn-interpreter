import SymbolTable from '../semantic/SymbolTable'
import { VarSymbol } from '../semantic/Symbol'

const symtab = new SymbolTable()
const intType = symtab.lookup('INTEGER')
const x = new VarSymbol('x', intType)
symtab.define(x)
console.log(symtab.toString())
