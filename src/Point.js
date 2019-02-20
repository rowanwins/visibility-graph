import { pi1, pi2 } from './utils'

export class Point {

  constructor (coords, polygonID) {
    if (polygonID === null) polygonID = -1
    this.x = coords[0]
    this.y = coords[1]
    this.polygonID = polygonID
    this.edges = []
    this.prevPoint = null
    this.nextPoint = null
  }

  isPointEqual (otherPoint) {
    return this.x === otherPoint.x && this.y === otherPoint.y
  }

  angleToPoint (otherPoint) {
    if (this.isPointEqual(otherPoint)) return 0
    const dx = otherPoint.x - this.x
    const dy = otherPoint.y - this.y
    if (dx === 0) dy < 1 ? pi1 : pi2
    if (dy === 0) dx < 0 ? Math.PI : 0
    if (dx < 0) return Math.PI + Math.atan(dy / dx)
    if (dy < 0) return 2 * Math.PI + Math.atan(dy / dx)
    return Math.atan(dy / dx)
  }
}
