export default class Token {
  constructor (type, value) {
    this.type = type
    this.value = value
  }

  toString () {
    return `Token(${this.type.toString()}, ${this.value})`
  }
}
