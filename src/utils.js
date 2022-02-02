import Point from './Point'
import { orient2d } from 'robust-predicates'

export const pi1 = Math.PI * 3 / 2
export const pi2 = Math.PI / 2

export function edgeIntersect (p1, q1, edge) {
  const p2 = edge.p1
  const q2 = edge.p2
  const o1 = ccw(p1, q1, p2)
  const o2 = ccw(p1, q1, q2)
  const o3 = ccw(p2, q2, p1)
  const o4 = ccw(p2, q2, q1)
  if (o1 !== o2 && o3 !== o4) return true
  if (o1 === 0) {
    if (onSegment(p1, p2, q1)) return true
    if (onSegment(p1, q2, q1)) return true
    if (onSegment(p2, p1, q2)) return true
    if (onSegment(p2, q1, q2)) return true
  }
  return false
}

export function ccw (a, b, c) {
  const r = orient2d(c.x, c.y, b.x, b.y, a.x, a.y)
  if (r > 0) return 1
  if (r < 0) return -1
  return 0
}

export function onSegment (p, q, r) {
  if (q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x)) {
    if (q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y)) return true
  }
  return false
}

const COLIN_TOLERANCE = 10
const T = Math.pow(10, COLIN_TOLERANCE)
const T2 = Math.pow(10, COLIN_TOLERANCE)

export function angle2 (p1, p2, p3) {
  const a = Math.pow((p3.x - p2.x), 2) + Math.pow((p3.y - p2.y), 2)
  const b = Math.pow((p3.x - p1.x), 2) + Math.pow((p3.y - p1.y), 2)
  const c = Math.pow((p2.x - p1.x), 2) + Math.pow((p2.y - p1.y), 2)
  const cos = (a + c - b) / (2 * Math.sqrt(a) * Math.sqrt(c))
  return Math.acos(parseInt(cos * T) / T2)
  // const d = (a + c - b)
  // const e = (2 * Math.sqrt(a) * Math.sqrt(c))
  // const f = Math.acos(d / e)
  // if (isNaN(f)) {
  //   return 0
  //   // return Math.PI
  // }
  // return f
}

export function pointEdgeDistance (p1, p2, edge) {
  const ip = intersectPoint(p1, p2, edge)
  return ip !== null ? calcEdgeDistance(p1, ip) : 0
}

export function intersectPoint (p1, p2, edge) {
  if (edge.containsPoint(p1)) return p1
  if (edge.containsPoint(p2)) return p2
  if (edge.p1.x === edge.p2.x) {
    if (p1.x === p2.x) return null
    const pslope = (p1.y - p2.y) / (p1.x - p2.x)
    const intersectX = edge.p1.x
    const intersectY = pslope * (intersectX - p1.x) + p1.y
    return new Point([intersectX, intersectY], -1)
  }
  if (p1.x === p2.x) {
    const eslope = (edge.p1.y - edge.p2.y) / (edge.p1.x - edge.p2.x)
    const intersectX = p1.x
    const intersectY = eslope * (intersectX - edge.p1.x) + edge.p1.y
    return new Point([intersectX, intersectY], -1)
  }

  const pslope = (p1.y - p2.y) / (p1.x - p2.x)
  const eslope = (edge.p1.y - edge.p2.y) / (edge.p1.x - edge.p2.x)

  if (pslope === eslope) return null
  const intersectX = (eslope * edge.p1.x - pslope * p1.x + p1.y - edge.p1.y) / (eslope - pslope)
  const intersectY = eslope * (intersectX - edge.p1.x) + edge.p1.y
  return new Point([intersectX, intersectY], -1)
}

export function calcEdgeDistance (p1, p2) {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2))
}
