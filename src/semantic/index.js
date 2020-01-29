import NodeVisitor from '../visitor'
import { VarSymbol, ProcedureSymbol } from './Symbol'
import ScopedSymbolTable, { SCOPE_TYPE } from './ScopedSymbolTable'
import { ERROR_CODE, SemanticError } from '../error'

export default class Semantic extends NodeVisitor {
  constructor (tree, shouldLogScope = false) {
    super()
    this.tree = tree
    this.currentScope = null
    this.scopes = {}
    this.shouldLogScope = shouldLogScope
    this.output = []
  }

  error (token) {
    throw new SemanticError(`${ERROR_CODE.ID_NOT_DECLARE} -> ${token.toString()}`)
  }

  record (scope) {
    if (this.shouldLogScope) {
      this.output.push(scope.toString())
    }
  }

  visit_Num (node) {}

  visit_Var (node) {
    const name = node.value
    const symbol = this.currentScope.lookup(name)
    if (!symbol) {
      this.error(node.token)
    }
  }

  visit_UnaryOp (node) {
    this.visit(node.expr)
  }

  visit_BinOp (node) {
    this.visit(node.left)
    this.visit(node.right)
  }

  visit_NoOp (node) {}

  visit_Assign (node) {
    this.visit(node.right)
    this.visit(node.left)
  }

  visit_ProcedureCall (node) {
    const symbol = this.currentScope.lookup(node.name)
    if (!symbol) {
      this.error(node.token)
    } else {
      if (node.params.length !== symbol.params.length) {
        throw new SemanticError(`${ERROR_CODE.UNEXPECTED_ARGUMENT_COUNT} -> ${node.token}`)
      } else {
        node.params.forEach(param => this.visit(param))
      }
    }
  }

  visit_Compound (node) {
    node.statements.forEach(statement => this.visit(statement))
  }

  genVarSymbol (node) {
    return new VarSymbol(node.varNode.value, this.currentScope.lookup(node.typeNode.value))
  }

  visit_VarDecl (node) {
    const varSymbol = this.genVarSymbol(node)
    this.currentScope.insertVar(varSymbol, node.varNode.token)
  }

  visit_ProcedureDecl (node) {
    const procName = node.name
    const procSymbol = new ProcedureSymbol(node)
    this.currentScope.insertVar(procSymbol, node.token)

    const procedureScope = new ScopedSymbolTable(this.currentScope.level + 1, SCOPE_TYPE.PROCEDURE, procName, this.currentScope)
    this.currentScope = procedureScope
    this.scopes[procName] = procedureScope

    node.params.forEach(param => {
      const symbol = this.genVarSymbol(param)
      this.currentScope.insertVar(symbol, param.varNode.token)
      procSymbol.params.push(symbol)
    })

    this.visit(node.block)
    this.record(procedureScope)
    this.currentScope = this.currentScope.enclosingScope
  }

  visit_Block (node) {
    node.declarations.forEach(item => this.visit(item))
    this.visit(node.compound)
  }

  visit_Program (node) {
    const globalScope = new ScopedSymbolTable(1, SCOPE_TYPE.PROGRAM, node.name, this.currentScope)
    globalScope.initBuiltinType()
    this.currentScope = globalScope
    this.scopes[node.name] = globalScope

    this.visit(node.block)
    this.record(globalScope)
    this.currentScope = this.currentScope.enclosingScope
  }

  analyze () {
    this.visit(this.tree)
    return this.scopes
  }
}
