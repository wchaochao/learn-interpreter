import './src/style/main.css'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/base16-dark.css'
import CodeMirror from 'codemirror/lib/codemirror'
import 'codemirror/mode/pascal/pascal'
import lexer from './src/examples/lexer'
import parser from './src/examples/parser'
import semantic from './src/examples/semantic'
import compiler from './src/examples/compiler'
import interpreter from './src/examples/interpreter'
import text from './src/examples/text'

function main () {
  const editor = CodeMirror.fromTextArea(document.getElementById('code-area'), {
    mode: 'text/x-pascal',
    theme: 'base16-dark',
    lineNumbers: true,
    firstLineNumber: 1,
    intentUnit: 2,
    intentWithTabs: false,
    smartIntent: true,
    matchBrackets : true,
    autofocus: true
  })

  editor.setValue(text)

  const dom = document.querySelector('.result')

  function errorProcess (fn, code) {
    try {
      return fn(code)
    } catch (e) {
      console.error(e)
      return e
    }
  }

  document.querySelector('.lexer').addEventListener('click', () => {
    const code = editor.getValue()
    dom.textContent = errorProcess(lexer, code)
  })

  document.querySelector('.parser').addEventListener('click', () => {
    const code = editor.getValue()
    dom.textContent = errorProcess(parser, code)
  })

  document.querySelector('.semantic').addEventListener('click', () => {
    const code = editor.getValue()
    dom.textContent = errorProcess(semantic, code)
  })

  document.querySelector('.compiler').addEventListener('click', () => {
    const code = editor.getValue()
    dom.textContent = errorProcess(compiler, code)
  })

  document.querySelector('.interpreter').addEventListener('click', () => {
    const code = editor.getValue()
    dom.textContent = errorProcess(interpreter, code)
  })
}

main()
