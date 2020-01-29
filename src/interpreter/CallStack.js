export default class CallStack {
  constructor () {
    this.contexts = []
  }

  push (context) {
    this.contexts.push(context)
  }

  pop () {
    const context = this.contexts.pop()
    context.scope.context = null
    return context
  }

  peek () {
    return this.contexts[this.contexts.length - 1]
  }

  toString () {
    let result = `Call Stack\n`
    result += this.contexts.slice().reverse().join('\n\n')
    return result
  }
}
