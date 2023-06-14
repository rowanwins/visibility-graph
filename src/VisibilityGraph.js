import createGraph from 'ngraph.graph'
import fromJSON from 'ngraph.fromjson'
import toJSON from 'ngraph.tojson'
import GeoJsonHelper from './GeoJsonHelper.js'
import Point from './Point.js'
import Contour from './Contour.js'
import Edge from './Edge.js'
import { checkPointAgainstBbox, linkPoints } from './utils.js'

/**
 * VisibilityGraph
 */
export default class VisibilityGraph {
  /** @type {Graph & EventedType} */
  graph = null
  /** @type {MultiPolygon | Feature | JsonValue} */
  _geoJSON = null
  /** @type {Point[]} */
  _points = []
  /** @type {Point[]} */
  _clonedPoints = []
  /** @type {Edge[]} */
  _edges = []
  /** @type {Contour[]} */
  _polygons = []
  /** @type {Point} */
  _lastOrigin = null
  /** @type {Point} */
  _lastDestination = null

  /**
   * @param {MultiPolygon | Feature | JsonValue} geoJSON
   * @param {string | object} jsonGraph
   */
  constructor (geoJSON, jsonGraph = undefined) {
    this._geoJSON = geoJSON
    this.#setupStructure()

    if (jsonGraph) {
      this.graph = fromJSON(jsonGraph)
    } else {
      this.graph = createGraph()
      GeoJsonHelper.createGraphFromGeoJson(this)
    }
  }

  /**
   * @param {[number, number]} latLon LatLng coordinates (format: [lng, lat])
   */
  getNodeIdByLatLon (latLon) {
    for (let i = 0; i < this._points.length; i++) {
      if (this._points[i].x === latLon[0] && this._points[i].y === latLon[1]) return this._points[i].nodeId
    }
    return null
  }

  /**
   * @return {string}
   */
  saveGraphToJson () {
    return toJSON(this.graph)
  }

  /**
   * @param {Feature} origin
   * @param {Feature} destination
   * @return {{startNode: Point, endNode: Point}}
   */
  addStartAndEndPointsToGraph (origin, destination) {
    if (this._lastOrigin !== null) {
      this.graph.removeNode(this._lastOrigin.nodeId)
      this.graph.removeNode(this._lastDestination.nodeId)
    }

    this._lastOrigin = new Point(origin.geometry.coordinates, -1)
    this._lastDestination = new Point(destination.geometry.coordinates, -1)

    GeoJsonHelper.addSinglePoint(this, this._lastOrigin)
    GeoJsonHelper.addSinglePoint(this, this._lastDestination)

    return {
      startNode: this._lastOrigin,
      endNode: this._lastDestination
    }
  }

  /**
   * Set up the structure
   */
  #setupStructure () {
    const geom = this._geoJSON.type === 'Feature' ? this._geoJSON.geometry : this._geoJSON
    const coords = geom.type === 'Polygon' ? [geom.coordinates] : geom.coordinates // standardise the input

    coords.forEach((polygon, i) => {
      const contour = new Contour()
      const edges = contour.edges
      const bbox = contour.bbox
      this._polygons.push(contour)

      polygon.forEach((ring) => {
        let prevPoint = new Point(ring[0], i)
        let currentPoint = new Point(ring[1], i)
        checkPointAgainstBbox(prevPoint, bbox)
        checkPointAgainstBbox(currentPoint, bbox)

        prevPoint.nextPoint = currentPoint
        let nextPoint = new Point(ring[2], i)
        linkPoints(prevPoint, currentPoint, nextPoint)

        this._points.push(prevPoint)

        let prevEdge = new Edge(prevPoint, currentPoint)
        this._edges.push(prevEdge)
        edges.push(prevEdge)

        // Save me for later
        let firstPoint = prevPoint
        prevPoint = currentPoint
        currentPoint = nextPoint

        for (let ringIndex = 2; ringIndex < ring.length - 2; ringIndex++) {
          this._points.push(prevPoint)

          nextPoint = new Point(ring[ringIndex + 1], i)
          checkPointAgainstBbox(nextPoint, bbox)
          linkPoints(prevPoint, currentPoint, nextPoint)

          const e = new Edge(prevPoint, currentPoint)
          this._edges.push(e)
          edges.push(e)

          prevPoint = currentPoint
          currentPoint = nextPoint
          prevEdge = e
        }

        linkPoints(prevPoint, currentPoint, firstPoint)

        const secondLastEdge = new Edge(prevEdge.p2, currentPoint)
        this._edges.push(secondLastEdge)
        edges.push(secondLastEdge)

        const lastEdge = new Edge(currentPoint, firstPoint)
        linkPoints(currentPoint, firstPoint, firstPoint.nextPoint)
        this._edges.push(lastEdge)
        edges.push(lastEdge)

        this._points.push(prevPoint)
        this._points.push(nextPoint)
      })
    })

    this._clonedPoints = this._points.slice(0)
  }
}
