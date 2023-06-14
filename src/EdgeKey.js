import { angle2, edgeIntersect, pointEdgeDistance } from './utils.js'

/**
 * EdgeKey
 */
export default class EdgeKey {
  /** @type {Point} */
  p1
  /** @type {Point} */
  p2
  /** @type {Edge} */
  edge

  /**
   * @param {Point} p1
   * @param {Point} p2
   * @param {Edge} edge
   */
  constructor (p1, p2, edge) {
    this.p1 = p1
    this.p2 = p2
    this.edge = edge
  }

  /**
   * @param {EdgeKey} otherEdgeKey
   * @return {boolean}
   */
  isLessThanOtherEdgeKey (otherEdgeKey) {
    if (this.matchesOtherKey(otherEdgeKey)) return false
    if (!edgeIntersect(this.p1, this.p2, otherEdgeKey.edge)) return true
    const selfDistance = pointEdgeDistance(this.p1, this.p2, this.edge)
    const otherDistance = pointEdgeDistance(this.p1, this.p2, otherEdgeKey.edge)
    if (selfDistance > otherDistance) return false
    if (selfDistance < otherDistance) return true
    if (selfDistance === otherDistance) {
      let samePoint
      if (otherEdgeKey.edge.containsPoint(this.edge.p1)) {
        samePoint = this.edge.p1
      } else {
        samePoint = this.edge.p2
      }
      const aslf = angle2(this.p1, this.p2, this.edge.getOtherPointInEdge(samePoint))
      const aot = angle2(this.p1, this.p2, otherEdgeKey.edge.getOtherPointInEdge(samePoint))

      return aslf < aot;
    }
  }

  /**
   * @param {EdgeKey} otherEdgeKey
   * @return {boolean}
   */
  matchesOtherKey (otherEdgeKey) {
    return this.edge.areEdgesEqual(otherEdgeKey.edge)
  }

}
