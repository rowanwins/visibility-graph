import { Map } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { featureCollection, point, coordEach } from '@turf/turf'

let map = null
let startMarker = null
let endMarker = null
let selectionLayer = null
let polyLayer = null
let points = null
let pointsLyr = null
let vg = null
let foundPath = null
let pathFinder = null
let routeLayer = null

export function setupMap () {
  map = new Map('map', {
    minZoom: 1,
    maxZoom: 20,
    center: [0, 0],
    zoom: 2,
    crs: L.CRS.Simple
  })

  L.NumberedDivIcon = createNumberDiv()

  startMarker = L.marker([-17.9614, 122.2359], {
    draggable: true,
    icon: new L.NumberedDivIcon()
  }).addTo(map)

  endMarker = L.marker([-42.8821, 147.3272], {
    draggable: true,
    icon: new L.NumberedDivIcon()
  }).addTo(map)

  startMarker.on('drag', updatePathMarkers)
  endMarker.on('drag', updatePathMarkers)
  selectionLayer = L.layerGroup([]).addTo(map)
}

export function setData (data) {
  polyLayer = L.geoJson(data, {
    noClip: true,
    stroke: false,
    fillColor: '#8B99AE'
  }).addTo(map)

  map.fitBounds(polyLayer.getBounds(), {
    padding: [20, 20]
  })

  points = featureCollection([])

  pointsLyr = L.layerGroup([], {
    pane: 'popupPane'
  }).addTo(map)

  coordEach(data, function (currentCoord) {
    points.features.push(point([currentCoord[0], currentCoord[1]]))

    var layer = L.circleMarker([currentCoord[1], currentCoord[0]], {
      radius: 3,
      opacity: 0,
      fillOpacity: 0.5,
      origPoint: [currentCoord[0], currentCoord[1]]
    }).addTo(pointsLyr)
    layer.on('mouseover', highlightFeature)
    layer.on('mouseout', unhighlightFeature)

  }, true)
}

export function clearGraphRelatedData () {
  if (routeLayer !== null) routeLayer.setLatLngs([])
  if (selectionLayer !== null) selectionLayer.clearLayers()
}

export function setupRouteLayer () {
  routeLayer = L.polyline([], {
    color: '#EB3223'
  }).addTo(map)
}

export function setPathFinder (pathGraph) {
  pathFinder = pathGraph
  updatePathMarkers()
}

function updatePathMarkers () {
  if (vg === null) return
  routeLayer.setLatLngs([])
  const s = startMarker.toGeoJSON()
  const d = endMarker.toGeoJSON()
  const nodes = vg.addStartAndEndPointsToGraph(s, d)
  foundPath = pathFinder.find(nodes.startNode.nodeId, nodes.endNode.nodeId)
  drawPath()
}

function drawPath () {
  const pathLatLngs = foundPath.map(function (node) {
    return [node.data.y, node.data.x]
  })
  routeLayer.setLatLngs(pathLatLngs)
}

function unhighlightFeature () {
  selectionLayer.clearLayers()
}

export function setGraph (completedGraph) {
  vg = completedGraph
}

function highlightFeature (e) {
  if (vg === null) return

  selectionLayer.clearLayers()
  const nodeId = vg.getNodeIdByLatLon([e.target._latlng.lng, e.target._latlng.lat])
  const node = vg.graph.getNode(nodeId)

  vg.graph.forEachLinkedNode(nodeId, function (linkedNode, link) {
    L.polyline([[linkedNode.data.y, linkedNode.data.x], [node.data.y, node.data.x]], {
      weight: 0.5,
      opacity: 0.8,
      pane: 'shadowPane',
      interactive: false
    }).addTo(selectionLayer)
  })
}

function createNumberDiv () {
  return L.Icon.extend({
    options: {
      iconSize: new L.Point(15, 15),
      className: 'leaflet-div-icon'
    },
    createIcon: function () {
      var div = document.createElement('div')
      var numdiv = document.createElement('div')
      numdiv.setAttribute('class', 'number')
      numdiv.innerHTML = this.options['number'] || ''
      div.appendChild(numdiv)
      this._setIconStyles(div, 'icon')
      return div
    }
  })
}
