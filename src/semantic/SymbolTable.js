import { BuiltinTypeSymbol } from './Symbol'

export default class SymbolTable {
  constructor () {
    this._symbols = {}
    this.initBuiltins()
  }

  initBuiltins () {
    this.define(new BuiltinTypeSymbol('INTEGER'))
    this.define(new BuiltinTypeSymbol('REAL'))
  }

  define (symbol) {
    this._symbols[symbol.name] = symbol
  }

  lookup (name) {
    return this._symbols[name]
  }

  toString () {
    return `[${Object.values(this._symbols).join(', ')}]`
  }
}
