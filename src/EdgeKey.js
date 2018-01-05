import { edgeIntersect, pointEdgeDistance, angle2 } from './utils'

export class EdgeKey {

  constructor (p1, p2, edge) {
    this.p1 = p1
    this.p2 = p2
    this.edge = edge
  }

  isLessThanOtherEdgeKey (otherEdgeKey) {
    if (this.edge === otherEdgeKey.edge) return false
    if (!edgeIntersect(this.p1, this.p2, otherEdgeKey.edge)) return true
    const selfDistance = pointEdgeDistance(this.p1, this.p2, this.edge)
    const otherDistance = pointEdgeDistance(this.p1, this.p2, otherEdgeKey.edge)
    if (selfDistance > otherDistance) return false
    if (selfDistance < otherDistance) return true
    if (selfDistance === otherDistance) {
      let samePoint = null
      if (otherEdgeKey.edge.containsPoint(this.edge.p1)) samePoint = this.edge.p1
      else if (otherEdgeKey.edge.containsPoint(this.edge.p2)) samePoint = this.edge.p2
      const aslf = angle2(this.p1, this.p2, this.edge.getOtherPointInEdge(samePoint))
      const aot = angle2(this.p1, this.p2, otherEdgeKey.edge.getOtherPointInEdge(samePoint))
      if (aslf < aot) return true
      return false
    }
  }

  matchesOtherKey (otherKey) {
    return this.edge.areEdgesEquals(otherKey.edge)
  }

}
