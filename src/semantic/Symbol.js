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
    return `<BuiltinTypeSymbol(name='${this.name}')>`
  }
}

export class VarSymbol extends Symbol {
  constructor (name, type) {
    super(name, type)
  }

  toString () {
    return `<VarSymbol(name='${this.name}', type='${this.type.name}')>`
  }
}

export class ProcedureSymbol extends Symbol {
  constructor (node, params = []) {
    super(node.name)
    this.params = params
    this.node = node
  }

  toString () {
    let params = this.params.map(param => `${param.name}:${param.type.name}`).join(', ')
    return `<ProedureSymbol(name='${this.name}', params='${params}')>`
  }
}
