import NodeVisitor from '../visitor'
import { VarSymbol, ProcedureSymbol } from './Symbol'
import ScopedSymbolTable from './ScopedSymbolTable'
import { ERROR_CODE, SemanticError } from '../error'

export default class Semantic extends NodeVisitor {
  constructor (parser, shouldLogScope = false) {
    super()
    this.parser = parser
    this.currentScope = null
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
    const procSymbol = new ProcedureSymbol(procName)
    this.currentScope.insertVar(procSymbol, `procedure ${procName}`)

    const procedureScope = new ScopedSymbolTable(this.currentScope.level + 1, procName, this.currentScope)
    this.currentScope = procedureScope

    if (node.params) {
      procSymbol.params = []
      node.params.forEach(param => {
        const symbol = this.genVarSymbol(param)
        this.currentScope.insertVar(symbol, param.varNode.token)
        procSymbol.params.push(symbol)
      })
    }

    this.visit(node.block)
    this.record(procedureScope)
    this.currentScope = this.currentScope.enclosingScope
  }

  visit_Block (node) {
    node.declarations.forEach(item => this.visit(item))
    this.visit(node.compound)
  }

  visit_Program (node) {
    const globalScope = new ScopedSymbolTable(1, 'global', this.currentScope)
    globalScope.initBuiltinType()
    this.currentScope = globalScope

    this.visit(node.block)
    this.record(globalScope)
    this.currentScope = this.currentScope.enclosingScope
  }

  analyze () {
    let tree = this.parser.parse()
    this.visit(tree)
  }
}
