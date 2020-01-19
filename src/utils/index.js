export function isWhitespace (char) {
  return /^\s$/.test(char)
}

export function isComment (char) {
  return char !== '}' && !isTerminator(char)
}

export function isTerminator (char) {
  return ['\u000A', '\u000D', '\u2028', '\u2028'].indexOf(char) !== -1
}

export function isAlpha (char) {
  return /^[a-zA-z_]$/.test(char)
}

export function isAlnum (char) {
  return /^\w$/.test(char)
}

export function isInteger (char) {
  return /^\d$/.test(char)
}

export function getClassName (obj) {
  return Object.prototype.toString.call(obj).slice(8, -1)
}

export function repeatChar (char, length) {
  return new Array(length).join(char)
}
