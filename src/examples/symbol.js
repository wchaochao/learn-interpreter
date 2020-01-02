import { BuiltinTypeSymbol, VarSymbol } from '../semantic/Symbol'

const intType = new BuiltinTypeSymbol('INTEGER')
const x = new VarSymbol('x', intType)
console.log(x.toString())
