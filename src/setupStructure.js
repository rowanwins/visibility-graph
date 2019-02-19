import { Point } from './Point'
import { Edge } from './Edge'

export function setupStructure (geojson, edges, points, polygons) {
  const geom = geojson.type === 'Feature' ? geojson.geometry : geojson

  let coords = geom.coordinates

  // standardise the input
  if (geom.type === 'Polygon') coords = [coords]

  for (let i = 0; i < coords.length; i++) {
    const contour = []
    polygons.push(contour)

    for (let ii = 0; ii < coords[i].length; ii++) {
      let prevPoint = new Point(coords[i][ii][0], i)
      let currentPoint = new Point(coords[i][ii][1], i)
      prevPoint.nextPoint = currentPoint
      let nextPoint = new Point(coords[i][ii][2], i)
      linkPoints(prevPoint, currentPoint, nextPoint)

      points.push(prevPoint)

      let prevEdge = new Edge(prevPoint, currentPoint) // eslint-disable-line
      edges.push(prevEdge)
      contour.push(prevEdge)

      // Save me for later
      const firstPoint = prevPoint

      prevPoint = currentPoint
      currentPoint = nextPoint

      for (let iii = 2; iii < coords[i][ii].length - 2; iii++) {
        points.push(prevPoint)

        nextPoint = new Point(coords[i][ii][iii + 1], i)

        linkPoints(prevPoint, currentPoint, nextPoint)

        const e = new Edge(prevPoint, currentPoint) // eslint-disable-line

        edges.push(e)
        contour.push(e)

        prevPoint = currentPoint
        currentPoint = nextPoint
        prevEdge = e
      }

      linkPoints(prevPoint, currentPoint, firstPoint)

      const secondLastEdge = new Edge(prevEdge.p2, currentPoint)

      edges.push(secondLastEdge)
      contour.push(secondLastEdge)

      const lastEdge = new Edge(currentPoint, firstPoint) // eslint-disable-line
      linkPoints(currentPoint, firstPoint, firstPoint.nextPoint)

      edges.push(lastEdge)
      contour.push(lastEdge)

      points.push(prevPoint)
      points.push(nextPoint)
    }
  }
}

function linkPoints (prevPoint, currentPoint, nextPoint) {
  currentPoint.prevPoint = prevPoint
  currentPoint.nextPoint = nextPoint
}
