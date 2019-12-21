export const RESERVED_KEYWORDS = {
  PROGRAM: Symbol('PROGRAM'),
  VAR: Symbol('VAR'),
  INTEGER: Symbol('INTEGER'),
  REAL: Symbol('REAL'),
  BEGIN: Symbol('BEGIN'),
  END: Symbol('END'),
  DIV: Symbol('INTEGER_DIV')
}

export const IDENTIFIER = {
  ID: Symbol('ID')
}

export const LITERAL = {
  INTEGER_CONST: Symbol('INTEGER_CONST'),
  FLOAT_CONST: Symbol('FLOAT_CONST')
}

export const PUNCTUATOR = {
  DOT: Symbol('DOT'),
  SEMI: Symbol('SEMI'),
  COLON: Symbol('COLON'),
  COMMA: Symbol('COMMA'),
  PLUS: Symbol('PLUS'),
  MINUS: Symbol('MINUS'),
  MUL: Symbol('MUL'),
  FLOAT_DIV: Symbol('FLOAT_DIV'),
  LPAREN: Symbol('LPAREN'),
  RPAREN: Symbol('RPAREN'),
  ASSIGN: Symbol('ASSIGN')
}

export const END = {
  EOF: Symbol('EOF')
}

export const TOKEN_TYPE = {
  ...RESERVED_KEYWORDS,
  ...IDENTIFIER,
  ...LITERAL,
  ...PUNCTUATOR,
  ...END
}

export const SINGLE_PUNCTUATOR_MAP = {
  '.': TOKEN_TYPE.DOT,
  ';': TOKEN_TYPE.SEMI,
  ':': TOKEN_TYPE.COLON,
  ',': TOKEN_TYPE.COMMA,
  '+': TOKEN_TYPE.PLUS,
  '-': TOKEN_TYPE.MINUS,
  '*': TOKEN_TYPE.MUL,
  '/': TOKEN_TYPE.FLOAT_DIV,
  '(': TOKEN_TYPE.LPAREN,
  ')': TOKEN_TYPE.RPAREN
}

export function include (type, keys) {
  return keys.some(key => TOKEN_TYPE[key] === type)
}
