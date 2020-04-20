export default class Edge {
  constructor (p1, p2) {
    this.p1 = p1
    this.p2 = p2

    p1.edges.push(this)
    p2.edges.push(this)
  }

  getOtherPointInEdge (point) {
    return this.p1.isPointEqual(point) ? this.p2 : this.p1
  }

  areEdgesEqual (otherEdge) {
    if (this.p1.isPointEqual(otherEdge.p1) && this.p2.isPointEqual(otherEdge.p2)) return true
    if (this.p1.isPointEqual(otherEdge.p2) && this.p2.isPointEqual(otherEdge.p1)) return true
    return false
  }

  containsPoint (point) {
    return this.p1.isPointEqual(point) || this.p2.isPointEqual(point)
  }
}
