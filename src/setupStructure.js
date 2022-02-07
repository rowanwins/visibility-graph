import Contour from './Contour'
import Point from './Point'
import Edge from './Edge'

export function setupStructure (vg) {
  const geom = vg._geojson.type === 'Feature' ? vg._geojson.geometry : vg._geojson

  let coords = geom.coordinates

  // standardise the input
  if (geom.type === 'Polygon') coords = [coords]

  for (let i = 0; i < coords.length; i++) {
    const contour = new Contour()
    const edges = contour.edges
    const bbox = contour.bbox
    vg._polygons.push(contour)

    for (let ii = 0; ii < coords[i].length; ii++) {
      let prevPoint = new Point(coords[i][ii][0], i)
      let currentPoint = new Point(coords[i][ii][1], i)
      checkPointAgainstBbox(prevPoint, bbox)
      checkPointAgainstBbox(currentPoint, bbox)

      prevPoint.nextPoint = currentPoint
      let nextPoint = new Point(coords[i][ii][2], i)
      linkPoints(prevPoint, currentPoint, nextPoint)

      vg._points.push(prevPoint)

      let prevEdge = new Edge(prevPoint, currentPoint)
      vg._edges.push(prevEdge)
      edges.push(prevEdge)

      // Save me for later
      const firstPoint = prevPoint

      prevPoint = currentPoint
      currentPoint = nextPoint

      for (let iii = 2; iii < coords[i][ii].length - 2; iii++) {
        vg._points.push(prevPoint)

        nextPoint = new Point(coords[i][ii][iii + 1], i)
        checkPointAgainstBbox(nextPoint, bbox)

        linkPoints(prevPoint, currentPoint, nextPoint)

        const e = new Edge(prevPoint, currentPoint) // eslint-disable-line

        vg._edges.push(e)
        edges.push(e)

        prevPoint = currentPoint
        currentPoint = nextPoint
        prevEdge = e
      }

      linkPoints(prevPoint, currentPoint, firstPoint)

      const secondLastEdge = new Edge(prevEdge.p2, currentPoint)

      vg._edges.push(secondLastEdge)
      edges.push(secondLastEdge)

      const lastEdge = new Edge(currentPoint, firstPoint) // eslint-disable-line
      linkPoints(currentPoint, firstPoint, firstPoint.nextPoint)

      vg._edges.push(lastEdge)
      edges.push(lastEdge)

      vg._points.push(prevPoint)
      vg._points.push(nextPoint)
    }
  }

  vg._clonedPoints = clonePoints(vg._points)
}

function clonePoints (points) {
  return points.slice(0)
}

function checkPointAgainstBbox (point, bbox) {
  bbox[0] = Math.min(bbox[0], point.x)
  bbox[1] = Math.min(bbox[1], point.y)
  bbox[2] = Math.max(bbox[2], point.x)
  bbox[3] = Math.max(bbox[3], point.y)
}
function linkPoints (prevPoint, currentPoint, nextPoint) {
  currentPoint.prevPoint = prevPoint
  currentPoint.nextPoint = nextPoint
}
