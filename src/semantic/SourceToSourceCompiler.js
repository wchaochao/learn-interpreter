import NodeVisitor from '../visitor'
import ScopedSymbolTable from './ScopedSymbolTable'
import { VarSymbol, ProcedureSymbol } from './Symbol'

export default class SourceToSourceCompiler extends NodeVisitor {
  constructor (parser) {
    super()
    this.parser = parser
    this.currentScope = null
    this.output = ''
  }

  error (name) {
    throw new Error(`The variable ${name} does not declare`)
  }

  visit_Num (node) {
    return String(node.value)
  }

  visit_Var (node) {
    const name = node.value
    const symbol = this.currentScope.lookup(name)
    if (!symbol) {
      this.error(name)
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
    this.currentScope.insertVar(varSymbol)
    return `VAR ${varSymbol.name}${varSymbol.scope.level} : ${varSymbol.type.name};`
  }

  visit_ProcedureDecl (node) {
    const procName = node.name
    const procSymbol = new ProcedureSymbol(procName)
    this.currentScope.insertVar(procSymbol)
    let result = `\nPROCEDURE ${procName}${procSymbol.scope.level}`

    const procedureScope = new ScopedSymbolTable(this.currentScope.level + 1, procName, this.currentScope)
    this.currentScope = procedureScope

    if (node.params) {
      result += '('
      procSymbol.params = []
      let formalParams = []
      node.params.forEach(param => {
        const symbol = this.genVarSymbol(param)
        this.currentScope.insertVar(symbol)
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
    const globalScope = new ScopedSymbolTable(1, 'global', this.currentScope)
    globalScope.initBuiltinType()
    this.currentScope = globalScope

    result += this.visit(node.block)
    result += `. {END OF ${node.name}}`
    this.currentScope = this.currentScope.enclosingScope
    return result
  }

  compile () {
    let tree = this.parser.parse()
    return this.visit(tree)
  }
}
