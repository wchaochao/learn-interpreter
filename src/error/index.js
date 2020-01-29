export const ERROR_CODE = {
  UNEXPECTED_CHAR: 'Unexpected char',
  UNEXPECTED_TOKEN: 'Unexpected token',
  ID_NOT_DECLARE: 'Identifier not declare',
  DUPLICATE_ID: 'Duplicate identifier declare',
  UNEXPECTED_ARGUMENT_COUNT: 'Unexpected argument count'
}

export class LexerError extends Error {
  constructor (message) {
    super(message)
    this.name = 'LexerError'
  }
}

export class ParserError extends Error {
  constructor (message) {
    super(message)
    this.name = 'ParserError'
  }
}

export class SemanticError extends Error {
  constructor (message) {
    super(message)
    this.name = 'SemanticError'
  }
}
