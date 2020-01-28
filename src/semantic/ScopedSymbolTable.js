import { BuiltinTypeSymbol } from './Symbol'
import { repeatChar } from '../utils'
import { ERROR_CODE, SemanticError } from '../error'

export default class ScopedSymbolTable {
  constructor (level, name, enclosingScope = null) {
    this.level = level
    this.name = name
    this._symbols = {}
    this.enclosingScope = enclosingScope
  }

  insert (symbol) {
    this._symbols[symbol.name] = symbol
    symbol.scope = this
    return symbol
  }

  initBuiltinType () {
    this.insert(new BuiltinTypeSymbol('INTEGER'))
    this.insert(new BuiltinTypeSymbol('REAL'))
  }

  insertVar (symbol, token) {
    if (this.lookup(symbol.name, true)) {
      throw new SemanticError(`${ERROR_CODE.DUPLICATE_ID} -> ${token.toString()}`)
    } else {
      return this.insert(symbol)
    }
  }

  lookup (name, currentScopeOnly) {
    const symbol = this._symbols[name]
    if (symbol) {
      return symbol
    }

    if (currentScopeOnly) {
      return
    }

    if (this.enclosingScope) {
      return this.enclosingScope.lookup(name, currentScopeOnly)
    }
  }

  toString () {
    const h1 = 'SCOPE (SCOPE SYMBOL TABLE)'
    const lines = [h1, repeatChar('=', h1.length)]
    lines.push(`Scope level: ${this.level}`)
    lines.push(`Scope name: ${this.name}`)
    lines.push(`Enclosing scope: ${this.enclosingScope ? this.enclosingScope.name : null}`)

    const h2 = 'Scope (Scoped symbol table) contents'
    lines.push(h2)
    lines.push(repeatChar('-', h2.length))
    for (let name in this._symbols) {
      lines.push(`${name}: ${this._symbols[name].toString()}`)
    }

    return lines.join('\n')
  }
}
