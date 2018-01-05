import { coordEach } from '@turf/meta'
import { Edge } from './Edge'
import { EdgeKeys } from './EdgeKeys'
import { EdgeKey } from './EdgeKey'
import { Point } from './Point'
import { INF, edgeIntersect, onSegment, ccw, edgeDistance } from './utils'
import { _renderSortedPoints, _renderOpenEdges } from './debug'

export class Graph {

  constructor (polygons) {
    this.points = []
    this.edges = []
    this.vg = []

    let prevGeomIndex = 0
    let subtractCoordIndex = 0

    var g = this
    coordEach(polygons, function (currentCoord, coordIndex, featureIndex, multiFeatureIndex, geometryIndex) {

      if (geometryIndex > prevGeomIndex) {
        prevGeomIndex = geometryIndex
        subtractCoordIndex = coordIndex
      }
      var nextCoordIndex = (coordIndex - subtractCoordIndex) + 1
      if (nextCoordIndex === polygons.features[featureIndex].geometry.coordinates[geometryIndex].length) nextCoordIndex = 0

      const nextPoint = polygons.features[featureIndex].geometry.coordinates[geometryIndex][nextCoordIndex]
      const p1 = new Point(currentCoord[0], currentCoord[1], geometryIndex)
      const p2 = new Point(nextPoint[0], nextPoint[1], geometryIndex)

      g.edges.push(new Edge(p1, p2))
      g.points.push(p1)
    }, true)

  }

  processGraph () {
    const allVisible = []
    for (var i = 0; i < this.points.length; i++) {
      const p = this.points[i]

      this.sortPoints(p)

      // _renderSortedPoints(p, this.points)

      const openEdges = new EdgeKeys()
      const pointInf = new Point(INF, p.y)
      for (let ii = 0; ii < this.edges.length; ii++) {
        const e = this.edges[ii]
        if (e.containsPoint(p)) continue
        if (edgeIntersect(p, pointInf, e)) {
          if (onSegment(p, e.p1, pointInf) || onSegment(p, e.p2, pointInf)) continue
          openEdges.addKey(new EdgeKey(p, pointInf, e))
        }
      }
      _renderOpenEdges(p, openEdges.keys)

      const visible = []
      let prev = null
      let prevVisible = null
      for (let ii = 0; ii < this.points.length; ii++) {
        const p2 = this.points[ii]
        if (p2 === p) continue
        if (openEdges.keys.length > 0) {
          for (let iii = 0; iii < this.edges.length; iii++) {
            const e = this.edges[iii]
            if (ccw(p, p2, e.getOtherPointInEdge(p2)) === -1) {
              const k = new EdgeKey(p, p2, e)
              const index = openEdges.findKeyPosition(k) - 1
              if (index < 0) continue
              if (openEdges.keys.length > 0 && openEdges.keys[index].matchesOtherKey(k)) {
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
          if (isVisible && this.edgeInPolygon(prev, p2)) isVisible = false
        }

        var prevPoint = ii === 0 ? this.points[this.points.length - 1] : this.points[ii - 1]
        var nextPoint = ii < this.points.length - 1 ? this.points[ii + 1] : this.points[0]

        // if (p.x === 14.414062499999998 && p.y === 12.897489183755892) console.log(prevPoint, nextPoint)
        if (isVisible && (!p2.isPointEqual(prevPoint) || !p2.isPointEqual(nextPoint))) isVisible = !this.edgeInPolygon(p, p2)

        if (isVisible) visible.push(p2)

        for (let iii = 0; iii < this.edges.length; iii++) {
          const e = this.edges[iii]
          if (!e.containsPoint(p) && ccw(p, p2, e.getOtherPointInEdge(p2)) === 1) {
            const k = new EdgeKey(p, p2, e)
            openEdges.addKey(k)
          }
        }

        prev = p2
        prevVisible = isVisible
      }
      allVisible.push({
        point: p,
        otherVis: visible
      })
    }
    return allVisible
  }

  copyPoints () {
    return this.points.slice(0)
  }

  sortPoints (point) {
    this.points.sort((a, b) => {
      const angle1 = point.angleToPoint(a)
      const angle2 = point.angleToPoint(b)
      if (angle1 < angle2) return -1
      if (angle1 > angle2) return 1
      const dist1 = edgeDistance(a, point)
      const dist2 = edgeDistance(b, point)
      if (dist1 < dist2) return -1
      if (dist1 > dist2) return 1
      return 0
    })
  }

  edgeInPolygon (p1, p2) {
    if (p1.polygonID !== p2.polygonID) return false
    if (p1.polygonID === -1 || p2.polygonID === -1) return false
    const midPoint = new Point((p1.x + p2.x) / 2, (p1.y + p2.y) / 2)
    return this.polygonCrossing(midPoint, this.edges)
  }

  polygonCrossing (p1, polyEdges) {
    const p2 = new Point(INF, p1.y)
    let intersectCount = 0
    let coFlag = false
    let coDir = 0
    for (let i = 0; i < polyEdges.length; i++) {
      const e = polyEdges[i]
      if (p1.y < e.p1.y && p1.y < e.p2.y) continue
      if (p1.y > e.p1.y && p1.y < e.p2.y) continue
      const co0 = ccw(p1, e.p1, p2) === 0 && e.p1.x > p1.x
      const co1 = ccw(p1, e.p2, p2) === 0 && e.p2.x > p1.x
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
    if (intersectCount / 2 === 0) return false
    return true
  }

}
