export const reservedTokenToType = {
  PROGRAM: 'PROGRAM',
  VAR: 'VAR',
  INTEGER: 'INTEGER',
  REAL: 'REAL',
  PROCEDURE: 'PROCEDURE',
  BEGIN: 'BEGIN',
  END: 'END',
  DIV: 'INTEGER_DIV'
}

const identifierTokenToType = {
  ID: 'ID'
}

const literalTokenToType = {
  INTEGER_CONST: 'INTEGER_CONST',
  FLOAT_CONST: 'FLOAT_CONST'
}

export const singlePunctuatorTokenToType = {
  '.': 'DOT',
  ',': 'COMMA',
  ':': 'COLON',
  ';': 'SEMI',
  '+': 'PLUS',
  '-': 'MINUS',
  '*': 'MUL',
  '/': 'FLOAT_DIV',
  '(': 'LPAREN',
  ')': 'RPAREN'
}

export const binaryPunctuatorTokenToType = {
  ':=': 'ASSIGN'
}

const eofTokenToType = {
  EOF: 'EOF'
}

const tokenToType = {
  ...reservedTokenToType,
  ...identifierTokenToType,
  ...literalTokenToType,
  ...singlePunctuatorTokenToType,
  ...binaryPunctuatorTokenToType,
  ...eofTokenToType
}

function buildTokenType () {
  let result = {}
  Object.values(tokenToType).forEach(type => result[type] = Symbol(type))
  return result
}

export const TOKEN_TYPE = buildTokenType()

export function include (type, keys) {
  return keys.some(key => TOKEN_TYPE[key] === type)
}
