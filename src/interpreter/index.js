import NodeVisitor from '../visitor/index'
import { TOKEN_TYPE } from '../lexer/constants'
import Semantic from '../semantic'
import CallStack from './CallStack'
import Context from './Context';

export default class Interpreter extends NodeVisitor {
  constructor (tree, shouldLogStack) {
    super()
    this.tree = tree
    this.scopes = new Semantic(tree).analyze()
    this.callStack = new CallStack()
    this.shouldLogStack = shouldLogStack
    this.output = []
  }

  record () {
    if (this.shouldLogStack) {
      this.output.push(this.callStack.toString())
    }
  }

  visit_Num (node) {
    return node.value
  }

  visit_Var (node) {
    let varName = node.value
    const context = this.callStack.peek()
    return context.get(varName)
  }

  visit_UnaryOp (node) {
    let op = node.token
    if (op.type === TOKEN_TYPE.PLUS) {
      return +(this.visit(node.expr))
    } else if (op.type === TOKEN_TYPE.MINUS) {
      return -(this.visit(node.expr))
    }
  }

  visit_BinOp (node) {
    let op = node.token
    if (op.type === TOKEN_TYPE.PLUS) {
      return this.visit(node.left) + this.visit(node.right)
    } else if (op.type === TOKEN_TYPE.MINUS) {
      return this.visit(node.left) - this.visit(node.right)
    } else if (op.type === TOKEN_TYPE.MUL) {
      return this.visit(node.left) * this.visit(node.right)
    } else if (op.type === TOKEN_TYPE.DIV) {
      return parseInt(this.visit(node.left) / this.visit(node.right))
    } else if (op.type === TOKEN_TYPE.FLOAT_DIV) {
      return this.visit(node.left) / this.visit(node.right)
    }
  }

  visit_NoOp () {}

  visit_Assign (node) {
    let varName = node.left.value
    const context = this.callStack.peek()
    context.set(varName, this.visit(node.right))
  }

  visit_ProcedureCall (node) {
    const scope = this.scopes[node.name]
    const context = new Context(scope)
    this.callStack.push(context)
    const symbol = scope.lookup(node.name)
    symbol.params.forEach((param, index) => {
      context.set(param.name, this.visit(node.params[index]))
    })
    this.visit(symbol.node.block)
    this.record()
    this.callStack.pop()
  }

  visit_Compound (node) {
    node.statements.forEach(statement => this.visit(statement))
  }

  visit_VarDecl () {}

  visit_ProcedureDecl () {}

  visit_Block (node) {
    node.declarations.forEach(declaration => this.visit(declaration))
    this.visit(node.compound)
  }

  visit_Program (node) {
    const scope = this.scopes[node.name]
    const context = new Context(scope)
    this.callStack.push(context)
    this.visit(node.block)
    this.record()
    this.callStack.pop()
  }

  interprete () {
    this.visit(this.tree)
  }
}
