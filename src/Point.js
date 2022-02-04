import { pi1, pi2 } from './utils'

let nodeId = 0

export default class Point {

  constructor (coords, polygonID) {
    this.x = coords[0]
    this.y = coords[1]
    this.nodeId = nodeId
    this.polygonID = polygonID
    this.edges = []
    this.prevPoint = null
    this.nextPoint = null
    nodeId++
  }

  isPointEqual (otherPoint) {
    if (otherPoint === null) return false
    return this.x === otherPoint.x && this.y === otherPoint.y
  }

  angleToPoint (otherPoint) {
    if (this.isPointEqual(otherPoint)) return 0
    const dx = otherPoint.x - this.x
    const dy = otherPoint.y - this.y
    if (dx === 0) return dy < 0 ? pi1 : pi2
    if (dy === 0) return dx < 0 ? Math.PI : 0
    if (dx < 0) return Math.PI + Math.atan(dy / dx)
    if (dy < 0) return 2 * Math.PI + Math.atan(dy / dx)
    return Math.atan(dy / dx)
  }
}
