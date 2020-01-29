import NodeVisitor from '../visitor'
import ScopedSymbolTable, { SCOPE_TYPE } from './ScopedSymbolTable'
import { VarSymbol, ProcedureSymbol } from './Symbol'
import { ERROR_CODE, SemanticError } from '../error'

export default class SourceToSourceCompiler extends NodeVisitor {
  constructor (tree) {
    super()
    this.tree = tree
    this.currentScope = null
    this.output = ''
  }

  error (token) {
    throw new SemanticError(`${ERROR_CODE.ID_NOT_DECLARE} -> ${token.toString()}`)
  }

  visit_Num (node) {
    return String(node.value)
  }

  visit_Var (node) {
    const name = node.value
    const symbol = this.currentScope.lookup(name)
    if (!symbol) {
      this.error(node.token)
    } else {
      return `<${name}${symbol.scope.level}:${symbol.type.name}>`
    }
  }

  visit_UnaryOp (node) {
    return `${node.token.value}${this.visit(node.expr)}`
  }

  visit_BinOp (node) {
    return `${this.visit(node.left)} ${node.token.value} ${this.visit(node.right)}`
  }

  visit_NoOp (node) {
    return ''
  }

  visit_Assign (node) {
    return `${this.visit(node.left)} ${node.token.value} ${this.visit(node.right)};`
  }

  visit_ProcedureCall (node) {
    const symbol = this.currentScope.lookup(node.name)
    if (!symbol) {
      this.error(node.token)
    } else {
      if (node.params.length !== symbol.params.length) {
        throw new SemanticError(`${ERROR_CODE.UNEXPECTED_ARGUMENT_COUNT} -> ${node.token}`)
      } else {
        let params = node.params.map(param => this.visit(param))
        return `${node.name}(${params.join(', ')})`
      }
    }
  }

  visit_Compound (node) {
    let result = '\nBEGIN'
    let arr = ['']
    node.statements.forEach(statement => {
      let str = this.visit(statement)
      if (str) {
        arr.push(str)
      }
    })
    result += arr.join('\n').replace(/\n/g, '\n  ')
    result += '\nEND'
    return result
  }

  genVarSymbol (node) {
    return new VarSymbol(node.varNode.value, this.currentScope.lookup(node.typeNode.value))
  }

  visit_VarDecl (node) {
    const varSymbol = this.genVarSymbol(node)
    this.currentScope.insertVar(varSymbol, node.varNode.token)
    return `VAR ${varSymbol.name}${varSymbol.scope.level} : ${varSymbol.type.name};`
  }

  visit_ProcedureDecl (node) {
    const procName = node.name
    const procSymbol = new ProcedureSymbol(node)
    this.currentScope.insertVar(procSymbol, node.token)
    let result = `\nPROCEDURE ${procName}${procSymbol.scope.level}`

    const procedureScope = new ScopedSymbolTable(this.currentScope.level + 1, SCOPE_TYPE.PROCEDURE, procName, this.currentScope)
    this.currentScope = procedureScope

    if (node.params.length) {
      result += '('
      let formalParams = []
      node.params.forEach(param => {
        const symbol = this.genVarSymbol(param)
        this.currentScope.insertVar(symbol, param.varNode.token)
        procSymbol.params.push(symbol)
        formalParams.push(`${symbol.name}${symbol.scope.level}: ${symbol.type.name}`)
      })
      result += formalParams.join('; ')
      result += ')'
    }

    result += ';'
    result += this.visit(node.block)
    result += `; {END OF ${procName}}`
    this.currentScope = this.currentScope.enclosingScope
    return result
  }

  visit_Block (node) {
    let result = []
    let arr = ['']
    node.declarations.forEach(item => arr.push(this.visit(item)))
    result.push(arr.join('\n').replace(/\n/g, '\n  '))
    result.push(this.visit(node.compound))
    return result.join('\n')
  }

  visit_Program (node) {
    let result = `PROGRAM ${node.name}0;`
    const globalScope = new ScopedSymbolTable(1, SCOPE_TYPE.PROGRAM, node.name, this.currentScope)
    globalScope.initBuiltinType()
    this.currentScope = globalScope

    result += this.visit(node.block)
    result += `. {END OF ${node.name}}`
    this.currentScope = this.currentScope.enclosingScope
    return result
  }

  compile () {
    return this.visit(this.tree)
  }
}
