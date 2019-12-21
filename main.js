const readline = require('readline')
const Lexer = require('./Lexer')
const Parser = require('./Parser')
const Interpreter = require('./Interpreter')

const rl = readline.createInterface(process.stdin, process.stdout)
rl.setPrompt('calc> ')
rl.prompt()

rl.on('line', line => {
  const lexer = new Lexer(line)
  const parser = new Parser(lexer)
  const interpreter = new Interpreter(parser)
  let result = interpreter.interprete()
  console.log(result)
  rl.prompt()
})
