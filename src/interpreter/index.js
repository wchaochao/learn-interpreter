import NodeVisitor from '../visitor/index'
import { TOKEN_TYPE } from '../lexer/constants'
import Semantic from '../semantic'

export default class Interpreter extends NodeVisitor {
  constructor (parser) {
    super()
    this.parser = parser
    this.semantic = new Semantic()
    this.GLOBAL_SCOPE = {}
  }

  visit_Num (node) {
    return node.value
  }

  visit_Var (node) {
    let varName = node.value
    return this.GLOBAL_SCOPE[varName]
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
    this.GLOBAL_SCOPE[varName] = this.visit(node.right)
  }

  visit_Compound (node) {
    node.statements.forEach(statement => this.visit(statement))
  }

  visit_Type () {}

  visit_VarDecl () {}

  visit_ProcedureDecl () {}

  visit_Block (node) {
    node.declarations.forEach(declaration => this.visit(declaration))
    this.visit(node.compound)
  }

  visit_Program (node) {
    this.visit(node.block)
  }

  interprete () {
    let tree = this.parser.parse()
    this.semantic.visit(tree)
    return this.visit(tree)
  }
}
