export class Symbol {
  constructor (name, type = null) {
    this.name = name
    this.type = type
  }
}

export class BuiltinTypeSymbol extends Symbol {
  constructor (name) {
    super(name)
  }

  toString () {
    return this.name
  }
}

export class VarSymbol extends Symbol {
  constructor (name, type) {
    super(name, type)
  }

  toString () {
    return `${this.name}:${this.type}`
  }
}
