import SymbolTable from '../semantic/SymbolTable'
import { VarSymbol } from '../semantic/Symbol'

const symtab = new SymbolTable()
const intType = symtab.insertBuiltinType('INTEGER')
const x = new VarSymbol('x', intType)
symtab.insertVar(x)
console.log(symtab.toString())
