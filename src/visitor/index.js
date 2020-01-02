import { getClassName } from '../utils/index'

export default class NodeVisitor {
  visit (node) {
    let methodName = `visit_${getClassName(node)}`
    let visitor = this[methodName] || this.genericVisit
    return visitor.call(this, node)
  }

  genericVisit (node) {
    throw new Error(`no visit_${getClassName(node)} method`)
  }
}
