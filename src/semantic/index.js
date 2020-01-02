import NodeVisitor from '../visitor'
import SymbolTable from './SymbolTable'
import { VarSymbol } from './Symbol'

export default class Semantic extends NodeVisitor {
  constructor () {
    super()
    this.symtab = new SymbolTable()
  }

  error (name) {
    throw new Error(`The variable ${name} does not declare`)
  }

  visit_Num (node) {}

  visit_Var (node) {
    const name = node.value
    const symbol = this.symtab.lookup(name)
    if (!symbol) {
      this.error(name)
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
    this.visit(node.left)
    this.visit(node.right)
  }

  visit_Compound (node) {
    node.statements.forEach(statement => this.visit(statement))
  }

  visit_VarDecl (node) {
    const typeName = node.typeNode.value
    const typeSymbol = this.symtab.lookup(typeName)
    const varName = node.varNode.value
    const varSymbol = new VarSymbol(varName, typeSymbol)
    this.symtab.define(varSymbol)
  }

  visit_Block (node) {
    node.declarations.forEach(item => this.visit(item))
    this.visit(node.compound)
  }

  visit_Program (node) {
    this.visit(node.block)
  }
}
