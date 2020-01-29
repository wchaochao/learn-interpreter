export class AST {}

export class Num extends AST {
  constructor (token) {
    super()
    this.token = token
    this.value = this.token.value
  }

  get [Symbol.toStringTag] () {
    return 'Num'
  }
}

export class Var extends AST {
  constructor (token) {
    super()
    this.token = token
    this.value = this.token.value
  }

  get [Symbol.toStringTag] () {
    return 'Var'
  }
}

export class UnaryOp extends AST {
  constructor (op, expr) {
    super()
    this.token = op,
    this.expr = expr
  }

  get [Symbol.toStringTag] () {
    return 'UnaryOp'
  }
}

export class BinOp extends AST {
  constructor (left, op, right) {
    super()
    this.token = op
    this.left = left
    this.right = right
  }

  get [Symbol.toStringTag] () {
    return 'BinOp'
  }
}

export class NoOp extends AST {
  constructor () {
    super()
  }

  get [Symbol.toStringTag] () {
    return 'NoOp'
  }
}

export class Assign extends AST {
  constructor (left, op, right) {
    super()
    this.token = op
    this.left = left
    this.right = right
  }

  get [Symbol.toStringTag] () {
    return 'Assign'
  }
}

export class ProcedureCall extends AST {
  constructor (token, params) {
    super()
    this.token = token
    this.name = token.value
    this.params = params
  }

  get [Symbol.toStringTag] () {
    return 'ProcedureCall'
  }
}

export class Compound extends AST {
  constructor (statements) {
    super()
    this.statements = statements
  }

  get [Symbol.toStringTag] () {
    return 'Compound'
  }
}

export class Type extends AST {
  constructor (token) {
    super()
    this.token = token
    this.value = this.token.value
  }

  get [Symbol.toStringTag] () {
    return 'Type'
  }
}

export class VarDecl extends AST {
  constructor (varNode, typeNode) {
    super()
    this.varNode = varNode
    this.typeNode = typeNode
  }

  get [Symbol.toStringTag] () {
    return 'VarDecl'
  }
}

export class Param extends AST {
  constructor (varNode, typeNode) {
    super()
    this.varNode = varNode
    this.typeNode = typeNode
  }

  get [Symbol.toStringTag] () {
    return 'Param'
  }
}

export class ProcedureDecl extends AST {
  constructor (token, params = [], block) {
    super()
    this.token = token
    this.name = token.value
    this.params = params
    this.block = block
  }

  get [Symbol.toStringTag] () {
    return 'ProcedureDecl'
  }
}

export class Block extends AST {
  constructor (declarations, compound) {
    super()
    this.declarations = declarations
    this.compound = compound
  }

  get [Symbol.toStringTag] () {
    return 'Block'
  }
}

export class Program extends AST {
  constructor (name, block) {
    super()
    this.name = name
    this.block = block
  }

  get [Symbol.toStringTag] () {
    return 'Program'
  }
}
