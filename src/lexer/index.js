import { isWhitespace, isComment, isAlpha, isAlnum, isInteger } from '../utils'
import { TOKEN_TYPE, reservedTokenToType, binaryPunctuatorTokenToType, singlePunctuatorTokenToType } from './constants'
import Token from './Token'
import { ERROR_CODE, LexerError } from '../error'

export default class Lexer {
  constructor (text) {
    this.text = text
    this.pos = 0
    this.line = 1
    this.column = 1
    this.currentChar = this.text[this.pos]
  }

  error () {
    throw new LexerError(`${ERROR_CODE.UNEXPECTED_CHAR} at ${this.line}:${this.column}`)
  }

  getPositionInfo () {
    return {
      pos: this.pos,
      line: this.line,
      column: this.column
    }
  }

  advanceBy (n = 1) {
    if (this.currentChar === '\n') {
      this.line++
      this.column = 0
    }

    this.pos += n
    if (this.pos > this.text.length - 1) {
      this.currentChar = null
    } else {
      this.currentChar = this.text[this.pos]
      this.column += n
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
    const pos = this.pos + n
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
    const id = this.advanceWhen(isAlnum).toUpperCase()
    const keyword = TOKEN_TYPE[reservedTokenToType[id]]
    const type = keyword || TOKEN_TYPE.ID
    return new Token(type, id, this.positionInfo)
  }

  number () {
    let result = this.advanceWhen(isInteger)
    if (this.currentChar === '.') {
      this.advanceBy()
      result += '.' + this.advanceWhen(isInteger)
      const number = parseFloat(result)
      return new Token(TOKEN_TYPE.FLOAT_CONST, number, this.positionInfo)
    } else {
      const number = parseInt(result)
      return new Token(TOKEN_TYPE.INTEGER_CONST, number, this.positionInfo)
    }
  }

  getNextToken () {
    while (this.currentChar) {
      let char = this.currentChar
      this.positionInfo = this.getPositionInfo()
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

      let binaryPunctuator = char + this.peekBy()
      let binaryType = TOKEN_TYPE[binaryPunctuatorTokenToType[binaryPunctuator]]
      if (binaryType) {
        this.advanceBy(2)
        return new Token(binaryType, binaryPunctuator, this.positionInfo)
      }

      let type = TOKEN_TYPE[singlePunctuatorTokenToType[char]]
      if (type) {
        this.advanceBy()
        return new Token(type, char, this.positionInfo)
      }

      this.error()
    }

    return new Token(TOKEN_TYPE.EOF, null, this.getPositionInfo())
  }

  output () {
    let result = []
    let token
    do {
      token = this.getNextToken()
      result.push(token.toString())
    } while (token.value !== null)
    return result.join('\n')
  }
}
