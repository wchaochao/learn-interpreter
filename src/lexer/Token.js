export default class Token {
  constructor (type, value, position) {
    this.type = type
    this.value = value
    this.position = position
  }

  toString () {
    return `Token(${this.type.toString()}, '${this.value}', position=${this.position.line}:${this.position.column})`
  }

  toJSON () {
    return this.toString()
  }
}
