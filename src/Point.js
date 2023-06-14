import { pi1, pi2 } from './constants.js'

/**
 * Point class
 */
export default class Point {
  /** @type {number} */
  static #nodeId = 0

  /** @type {number} */
  x = 0
  /** @type {number} */
  y = 0
  /** @type {number} */
  nodeId = 0
  /** @type {number} */
  polygonID = 0
  /** @type {Point} */
  prevPoint = null
  /** @type {Point} */
  nextPoint = null
  /** @type {Edge[]} */
  edges = []

  /**
   * Create a point
   * @param {number[]} coords
   * @param {number} polygonID
   */
  constructor (coords, polygonID) {
    this.x = coords[0]
    this.y = coords[1]
    this.nodeId = Point.#nodeId++
    this.polygonID = polygonID
  }

  /**
   * Compare two points
   * @param otherPoint {Point}
   * @return {boolean}
   */
  isPointEqual (otherPoint) {
    return otherPoint && this.x === otherPoint.x && this.y === otherPoint.y
  }

  /**
   * Get angle between two points
   * @param {Point} otherPoint
   * @return {number}
   */
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
