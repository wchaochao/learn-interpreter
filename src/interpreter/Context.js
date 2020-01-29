export default class Context {
  constructor (scope) {
    this.scope = scope
    scope.context = this
    this.members = {}
  }

  setItem (key, value) {
    this.members[key] = value
  }

  getItem (key) {
    return this.members[key]
  }

  getCorrespondContext (key) {
    const symbol = this.scope.lookup(key)
    return symbol.scope.context
  }

  set (key, value) {
    const context = this.getCorrespondContext(key)
    context.setItem(key, value)
  }

  get (key) {
    const context = this.getCorrespondContext(key)
    return context.getItem(key)
  }

  toString () {
    const scope = this.scope
    let arr = [`${scope.level}: ${scope.type} ${scope.name}`]
    Object.keys(this.members).forEach(key => arr.push(`  ${key}: ${this.members[key]}`))
    return arr.join('\n')
  }
}
