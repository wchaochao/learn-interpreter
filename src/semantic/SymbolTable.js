import { BuiltinTypeSymbol } from './Symbol'

export default class SymbolTable {
  constructor () {
    this._symbols = {}
  }

  insert (symbol) {
    this._symbols[symbol.name] = symbol
    return symbol
  }

  insertBuiltinType (name) {
    return this.lookup(name) || this.insert(new BuiltinTypeSymbol(name))
  }

  insertVar (symbol) {
    if (this.lookup(symbol.name)) {
      throw new Error(`The variable ${symbol.name} has been declared`)
    } else {
      return this.insert(symbol)
    }
  }

  lookup (name) {
    return this._symbols[name]
  }

  toString () {
    return `[${Object.values(this._symbols).join(', ')}]`
  }
}
