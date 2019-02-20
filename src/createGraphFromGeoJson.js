import createGraph from 'ngraph.graph'
import { EdgeKeys } from './EdgeKeys'
import { EdgeKey } from './EdgeKey'
import { Point } from './Point'
import { setupStructure } from './setupStructure'
import { INF, edgeIntersect, onSegment, ccw, calcEdgeDistance } from './utils'
import { _renderSortedPoints, _renderOpenEdges } from './debug' //eslint-disable-line

export function createGraphFromGeoJson (geojson) {

  const points = []
  const edges = []
  const polygons = []

  setupStructure(geojson, edges, points, polygons)

  return processGraph()

  function processGraph () {
    const g = createGraph()
    const pointsLen = points.length
    const clonedPoints = clonePoints()

    for (var i = 0; i < pointsLen; i++) {
      const p = points[i]
      const prevPoint = p.prevPoint
      const nextPoint = p.nextPoint

      sortPoints(p, clonedPoints)
      // _renderSortedPoints(p, clonedPoints)

      const openEdges = new EdgeKeys()
      const pointInf = new Point([INF, p.y], null)
      for (let ii = 0; ii < edges.length; ii++) {
        const e = edges[ii]
        if (e.containsPoint(p)) continue
        if (edgeIntersect(p, pointInf, e)) {
          if (onSegment(p, e.p1, pointInf) || onSegment(p, e.p2, pointInf)) continue
          openEdges.addKey(new EdgeKey(p, pointInf, e))
        }
      }
      // _renderOpenEdges(p, openEdges.keys)

      const visible = []
      let prev = null
      let prevVisible = null

      for (let ii = 0; ii < pointsLen; ii++) {
        const p2 = clonedPoints[ii]
        if (p2.isPointEqual(p)) continue
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
          if (isVisible && edgeInPolygon(prev, p2)) isVisible = false
        }

        const isInAdjacentPoints = p2.isPointEqual(prevPoint) || p2.isPointEqual(nextPoint)
        if (isVisible && !isInAdjacentPoints) isVisible = !edgeInPolygon(p, p2)

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

      const nodeId = createNodeId(p)
      g.addNode(nodeId, p)

      for (var ii = 0; ii < visible.length; ii++) {
        const otherNodeId = createNodeId(visible[ii])
        g.addNode(otherNodeId, visible[ii])
        g.addLink(nodeId, otherNodeId)
      }
    }
    return g
  }

  function createNodeId (p) {
    return p.x + ',' + p.y
  }

  function clonePoints () {
    return points.slice(0)
  }

  function sortPoints (point, clonedPoints) {
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

  function edgeInPolygon (p1, p2) {
    if (p1.polygonID !== p2.polygonID) return false
    if (p1.polygonID === -1 || p2.polygonID === -1) return false
    const midPoint = new Point([(p1.x + p2.x) / 2, (p1.y + p2.y) / 2], null)
    return polygonCrossing(midPoint, polygons[p1.polygonID])
  }

  function polygonCrossing (p1, polyEdges) {
    const p2 = new Point([INF, p1.y], null)
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

}
