/**
 * Edge class
 */
export default class Edge {
  /** @type {Point} */
  p1
  /** @type {Point} */
  p2

  /**
   * @param {Point} p1
   * @param {Point} p2
   */
  constructor (p1, p2) {
    this.p1 = p1
    this.p2 = p2

    p1.edges.push(this)
    p2.edges.push(this)
  }

  /**
   * @param {Point} point
   * @return {Point}
   */
  getOtherPointInEdge (point) {
    return this.p1.isPointEqual(point) ? this.p2 : this.p1
  }

  /**
   * @param {Edge} otherEdge
   * @return {boolean}
   */
  areEdgesEqual (otherEdge) {
    if (this.p1.isPointEqual(otherEdge.p1) && this.p2.isPointEqual(otherEdge.p2)) return true
    if (this.p1.isPointEqual(otherEdge.p2) && this.p2.isPointEqual(otherEdge.p1)) return true
    return false
  }

  /**
   * @param {Point} point
   * @return {boolean}
   */
  containsPoint (point) {
    return this.p1.isPointEqual(point) || this.p2.isPointEqual(point)
  }
}
