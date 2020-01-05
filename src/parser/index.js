import { TOKEN_TYPE, include } from '../lexer/constants'
import { Num, Var, UnaryOp, BinOp, NoOp, Assign, Compound, Type, VarDecl, Block, Program, ProcedureDecl } from './AST'

export default class Parser {
  constructor (lexer) {
    this.lexer = lexer
    this.currentToken = lexer.getNextToken()
  }

  error () {
    throw new Error('Invalid Syntax')
  }

  eat (type) {
    let token = this.currentToken
    if (token.type === type) {
      this.currentToken = this.lexer.getNextToken()
      return token
    } else {
      this.error()
    }
  }

  number () {
    if (this.currentToken.type === TOKEN_TYPE.INTEGER_CONST) {
      return new Num(this.eat(TOKEN_TYPE.INTEGER_CONST))
    } else {
      return new Num(this.eat(TOKEN_TYPE.FLOAT_CONST))
    }
  }

  variable () {
    return new Var(this.eat(TOKEN_TYPE.ID))
  }

  factor () {
    let type = this.currentToken.type
    if (include(type, ['INTEGER_CONST', 'FLOAT_CONST'])) {
      return new Num(this.eat(type))
    }

    if (type === TOKEN_TYPE.ID) {
      return this.variable()
    }

    if (type === TOKEN_TYPE.LPAREN) {
      this.eat(TOKEN_TYPE.LPAREN)
      let node = this.expr()
      this.eat(TOKEN_TYPE.RPAREN)
      return node
    }

    this.error()
  }

  unary () {
    let type = this.currentToken.type
    if (include(type, ['PLUS', 'MINUS'])) {
      return new UnaryOp(this.eat(type), this.factor())
    } else {
      return this.factor()
    }
  }

  term () {
    let node = this.unary()
    while (include(this.currentToken.type, ['MUL', 'DIV', 'FLOAT_DIV'])) {
      node = new BinOp(node, this.eat(this.currentToken.type), this.unary())
    }
    return node
  }

  expr () {
    let node = this.term()
    while (include(this.currentToken.type, ['PLUS', 'MINUS'])) {
      node = new BinOp(node, this.eat(this.currentToken.type), this.term())
    }
    return node
  }

  empty () {
    return new NoOp()
  }

  assignment () {
    return new Assign(this.variable(), this.eat(TOKEN_TYPE.ASSIGN), this.expr())
  }

  statement () {
    let type = this.currentToken.type
    if (type === TOKEN_TYPE.BEGIN) {
      return this.compound()
    }

    if (type === TOKEN_TYPE.ID) {
      return this.assignment()
    }

    return this.empty()
  }

  statementList () {
    let statements = [this.statement()]
    while (this.currentToken.type === TOKEN_TYPE.SEMI) {
      this.eat(this.currentToken.type)
      statements.push(this.statement())
    }
    if (this.currentToken.type === TOKEN_TYPE.ID) {
      this.error()
    }
    return statements
  }

  compound () {
    this.eat(TOKEN_TYPE.BEGIN)
    let node = new Compound(this.statementList())
    this.eat(TOKEN_TYPE.END)
    return node
  }

  type () {
    if (include(this.currentToken.type, ['INTEGER', 'REAL'])) {
      return new Type(this.eat(this.currentToken.type))
    }
    this.error()
  }

  variableDeclaration () {
    let varNodes = [this.variable()]
    while (this.currentToken.type === TOKEN_TYPE.COMMA) {
      this.eat(this.currentToken.type)
      varNodes.push(this.variable())
    }
    this.eat(TOKEN_TYPE.COLON)
    let typeNode = this.type()
    return varNodes.map(node => new VarDecl(node, typeNode))
  }

  declarations () {
    let result = []

    if (this.currentToken.type === TOKEN_TYPE.VAR) {
      this.eat(this.currentToken.type)
      while (this.currentToken.type === TOKEN_TYPE.ID) {
        result = result.concat(this.variableDeclaration())
        this.eat(TOKEN_TYPE.SEMI)
      }
    }

    while (this.currentToken.type === TOKEN_TYPE.PROCEDURE) {
      this.eat(this.currentToken.type)
      const id = this.eat(TOKEN_TYPE.ID)
      this.eat(TOKEN_TYPE.SEMI)
      const block = this.block()
      result = result.concat(new ProcedureDecl(id.value, block))
      this.eat(TOKEN_TYPE.SEMI)
    }

    return result
  }

  block () {
    return new Block(this.declarations(), this.compound())
  }

  program () {
    this.eat(TOKEN_TYPE.PROGRAM)
    let name = this.eat(TOKEN_TYPE.ID).value
    this.eat(TOKEN_TYPE.SEMI)
    let block = this.block()
    this.eat(TOKEN_TYPE.DOT)
    return new Program(name, block)
  }

  parse () {
    return this.program()
  }
}
