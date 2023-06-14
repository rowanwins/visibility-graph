import EdgeKeys from './EdgeKeys.js'
import EdgeKey from './EdgeKey.js'
import Point from './Point.js'
import { edgeIntersect, onSegment, ccw, calcEdgeDistance } from './utils.js'

export const FULL_PROCESS = 0
export const HALF_PROCESS = 1

export function createGraphFromGeoJson (visibilityGraph) {
  processGraph(visibilityGraph)
}

export function addSinglePoint (visibilityGraph, p) {
  processPoint(p, visibilityGraph._points.length, FULL_PROCESS, visibilityGraph)
}

function processGraph (visibilityGraph) {
  const points = visibilityGraph._points
  const pointsLen = points.length
  const scan = HALF_PROCESS
  for (var i = 0; i < pointsLen; i++) {
    const p = points[i]
    processPoint(p, pointsLen, scan, visibilityGraph)
  }
}

export function processPoint (p, pointsLen, scan, visibilityGraph) {
  const clonedPoints = visibilityGraph._clonedPoints
  const edges = visibilityGraph._edges
  const polygons = visibilityGraph._polygons
  const g = visibilityGraph.graph
  const prevPoint = p.prevPoint
  const nextPoint = p.nextPoint

  sortPoints(p, clonedPoints)
  // _renderSortedPoints(p, clonedPoints)

  const openEdges = new EdgeKeys()
  const pointInf = new Point([Infinity, p.y], -1)
  for (let ii = 0; ii < pointsLen; ii++) {
    const e = edges[ii]
    if (e.containsPoint(p)) continue
    if (edgeIntersect(p, pointInf, e)) {
      if (onSegment(p, e.p1, pointInf) || onSegment(p, e.p2, pointInf)) continue
      openEdges.addKey(new EdgeKey(p, pointInf, e))
    }
  }
  if (openEdges.keys.length > 100) console.log(openEdges.keys.length)
  // _renderOpenEdges(p, openEdges.keys)

  const visible = []
  let prev = null
  let prevVisible = null

  for (let ii = 0; ii < pointsLen; ii++) {
    const p2 = clonedPoints[ii]
    if (p2.isPointEqual(p)) continue
    if (scan === HALF_PROCESS && p.angleToPoint(p2) > Math.PI) {
      break
    }

    if (openEdges.keys.length > 0) {
      for (let iii = 0; iii < p2.edges.length; iii++) {
        const e = p2.edges[iii]
        if (ccw(p, p2, e.getOtherPointInEdge(p2)) === -1) {
          const k = new EdgeKey(p, p2, e)
          const index = openEdges.findKeyPosition(k) - 1
          if (index !== -1 && openEdges.keys[index].matchesOtherKey(k)) {
            openEdges.keys.splice(index, 1)
          }
        }
      }
    }
    if (openEdges.keys.length > 100) console.log(openEdges.keys.length)

    let isVisible = false
    if (prev === null || ccw(p, prev, p2) !== 0 || !onSegment(p, prev, p2)) {
      if (openEdges.keys.length === 0) {
        isVisible = true
      } else if (!edgeIntersect(p, p2, openEdges.keys[0].edge)) {
        isVisible = true
      }
    } else if (!prevVisible) {
      isVisible = false
    } else {
      isVisible = true
      for (let iii = 0; iii < openEdges.keys.length; iii++) {
        const e = openEdges.keys[iii]
        if (!e.edge.containsPoint(prev) && edgeIntersect(prev, p2, e.edge)) {
          isVisible = false
          break
        }
      }
      if (isVisible && edgeInPolygon(prev, p2, polygons)) isVisible = false
    }

    const isInAdjacentPoints = p2.isPointEqual(prevPoint) || p2.isPointEqual(nextPoint)
    if (isVisible && !isInAdjacentPoints) isVisible = !edgeInPolygon(p, p2, polygons)

    if (isVisible) visible.push(p2)

    for (let iii = 0; iii < p2.edges.length; iii++) {
      const e = p2.edges[iii]
      if (!e.containsPoint(p) && ccw(p, p2, e.getOtherPointInEdge(p2)) === 1) {
        const k = new EdgeKey(p, p2, e)
        openEdges.addKey(k)
      }
    }

    prev = p2
    prevVisible = isVisible
  }
  const nodeId = p.nodeId
  g.addNode(nodeId, { x: p.x, y: p.y })

  for (var ii = 0; ii < visible.length; ii++) {
    const otherNodeId = visible[ii].nodeId
    g.addNode(otherNodeId, { x: visible[ii].x, y: visible[ii].y })
    g.addLink(nodeId, otherNodeId)
  }
}

export function sortPoints (point, clonedPoints) {
  clonedPoints.sort((a, b) => {
    const angle1 = point.angleToPoint(a)
    const angle2 = point.angleToPoint(b)
    if (angle1 < angle2) return -1
    if (angle1 > angle2) return 1
    const dist1 = calcEdgeDistance(point, a)
    const dist2 = calcEdgeDistance(point, b)
    if (dist1 < dist2) return -1
    if (dist1 > dist2) return 1
    return 0
  })
}

function edgeInPolygon (p1, p2, polygons) {
  if (p1.polygonID !== p2.polygonID) return false
  if (p1.polygonID === -1 || p2.polygonID === -1) return false
  const midPoint = new Point([(p1.x + p2.x) / 2, (p1.y + p2.y) / 2], -1)
  return polygonCrossing(midPoint, polygons[p1.polygonID].edges)
}

function polygonCrossing (p1, polyEdges) {
  const p2 = new Point([Infinity, p1.y], -1)
  let intersectCount = 0
  let coFlag = false
  let coDir = 0

  for (let i = 0; i < polyEdges.length; i++) {
    const e = polyEdges[i]
    if (p1.y < e.p1.y && p1.y < e.p2.y) continue
    if (p1.y > e.p1.y && p1.y > e.p2.y) continue
    const co0 = (ccw(p1, e.p1, p2) === 0) && (e.p1.x > p1.x)
    const co1 = (ccw(p1, e.p2, p2) === 0) && (e.p2.x > p1.x)
    const coPoint = co0 ? e.p1 : e.p2
    if (co0 || co1) {
      coDir = e.getOtherPointInEdge(coPoint).y > p1.y ? coDir++ : coDir--
      if (coFlag) {
        if (coDir === 0) intersectCount++
        coFlag = false
        coDir = 0
      } else {
        coFlag = true
      }
    } else if (edgeIntersect(p1, p2, e)) {
      intersectCount++
    }
  }
  if (intersectCount % 2 === 0) return false
  return true
}
