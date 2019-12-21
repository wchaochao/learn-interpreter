import { isWhitespace, isComment, isAlpha, isAlnum, isInteger } from '../utils'
import { TOKEN_TYPE, RESERVED_KEYWORDS, SINGLE_PUNCTUATOR_MAP } from '../utils/constants'
import Token from './Token'

export default class Lexer {
  constructor (text) {
    this.text = text
    this.pos = 0
    this.currentChar = this.text[this.pos]
  }

  error () {
    throw new Error('Invalid charactor')
  }

  advanceBy (n = 1) {
    this.pos += n
    if (this.pos > this.text.length - 1) {
      this.currentChar = null
    } else {
      this.currentChar = this.text[this.pos]
    }
  }

  advanceWhen (callback) {
    let result = ''
    while (this.currentChar && callback(this.currentChar)) {
      result += this.currentChar
      this.advanceBy()
    }
    return result
  }

  peekBy (n = 1) {
    let pos = this.pos + n
    if (pos > this.text.length - 1) {
      return null
    } else {
      return this.text[pos]
    }
  }

  peekValid (str) {
    let length = str.length
    for (let i = 0; i < length; i++) {
      if (str[i] !== this.peekBy(i)) {
        return false
      }
    }
    return true
  }

  whitespace () {
    this.advanceWhen(isWhitespace)
  }

  comment () {
    this.advanceWhen(isComment)
    if (this.currentChar === '}') {
      this.advanceBy()
    } else {
      throw new Error('单行注释不能换行')
    }
  }

  id () {
    let id = this.advanceWhen(isAlnum)
    let keyword = RESERVED_KEYWORDS[id]
    return new Token(keyword || TOKEN_TYPE.ID, id)
  }

  number () {
    let result = this.advanceWhen(isInteger)
    if (this.currentChar === '.') {
      this.advanceBy()
      result += '.' + this.advanceWhen(isInteger)
      let number = parseFloat(result)
      return new Token(TOKEN_TYPE.FLOAT_CONST, number)
    } else {
      let number = parseInt(result)
      return new Token(TOKEN_TYPE.INTEGER_CONST, number)
    }
  }

  integer () {
    let result = this.pluar(isInteger) 
    return parseInt(result)
  }

  getNextToken () {
    while (this.currentChar) {
      let char = this.currentChar
      if (isWhitespace(char)) {
        this.whitespace()
        continue
      }

      if (char === '{') {
        this.comment()
        continue
      }

      if (isAlpha(char)) {
        return this.id()
      }

      if (isInteger(char)) {
        return this.number()
      }

      if (this.peekValid(':=')) {
        this.advanceBy(2)
        return new Token(TOKEN_TYPE.ASSIGN, ':=')
      }

      let type = SINGLE_PUNCTUATOR_MAP[char]
      if (type) {
        this.advanceBy()
        return new Token(type, char)
      }

      this.error()
    }

    return new Token(TOKEN_TYPE.EOF, null)
  }
}