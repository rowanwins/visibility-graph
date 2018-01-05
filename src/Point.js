import { edgeDistance, pi1, pi2 } from './utils'

export class Point {

  constructor (x, y, polygonID) {
    if (polygonID === undefined) polygonID = -1
    this.x = x
    this.y = y
    this.polygonID = polygonID
  }

  isPointEqual (otherPoint) {
    return this.x && otherPoint.x && this.y === otherPoint.y
  }

  angleToPoint (otherPoint) {
    if (this.x === otherPoint.x && this.y === otherPoint.y) return 0
    const dx = otherPoint.x - this.x
    const dy = otherPoint.y - this.y
    if (dx === 0) dy < 1 ? pi1 : pi2
    if (dy === 0) dx < 0 ? Math.PI : 0
    if (dx < 0) return Math.PI + Math.atan(dy / dx)
    if (dy < 0) return 2 * Math.PI + Math.atan(dy / dx)
    return Math.atan(dy / dx)
  }

  edgeDistance (otherPoint) {
    return edgeDistance(this, otherPoint)
  }
}
