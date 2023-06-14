import createGraph from 'ngraph.graph'
import fromJSON from 'ngraph.fromjson'
import toJSON from 'ngraph.tojson'
import { createGraphFromGeoJson, addSinglePoint } from './createGraphFromGeoJson.js'
import { setupStructure } from './setupStructure.js'
import Point from './Point.js'

export default class VisibilityGraph {
  constructor (geojson, jsonGraph) {
    this._geojson = geojson
    this.graph = null

    this._points = []
    this._clonedPoints = []
    this._edges = []
    this._polygons = []

    this._lastOrigin = null
    this._lastDestination = null
    setupStructure(this)

    if (jsonGraph) {
      this.graph = fromJSON(jsonGraph)
    } else {
      this.graph = createGraph()
      createGraphFromGeoJson(this)
    }
  }

  getNodeIdByLatLon (latLon) {
    for (var i = 0; i < this._points.length; i++) {
      if (this._points[i].x === latLon[0] && this._points[i].y === latLon[1]) return this._points[i].nodeId
    }
    return null
  }

  saveGraphToJson () {
    return toJSON(this.graph)
  }

  addStartAndEndPointsToGraph (origin, destination) {
    if (this._lastOrigin !== null) {
      this.graph.removeNode(this._lastOrigin.nodeId)
      this.graph.removeNode(this._lastDestination.nodeId)
    }

    this._lastOrigin = new Point(origin.geometry.coordinates, -1)
    this._lastDestination = new Point(destination.geometry.coordinates, -1)

    addSinglePoint(this, this._lastOrigin)
    addSinglePoint(this, this._lastDestination)
    return {
      startNode: this._lastOrigin,
      endNode: this._lastDestination
    }
  }
}
