let map = null
let startMarker = null
let endMarker = null
let selectionLayer = null
let polyLayer = null
let points = null
let pointsLyr = null
let graphData = null
let foundPath = null
let pathFinder = null
let routeLayer = null

export function setupMap () {
  map = L.map('map', {
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

  points = turf.featureCollection([])

  pointsLyr = L.layerGroup([], {
    pane: 'popupPane'
  }).addTo(map)

  turf.meta.coordEach(data, function (currentCoord) {
    points.features.push(turf.point([currentCoord[0], currentCoord[1]]))

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
  routeLayer.setLatLngs([])
  var nearestStart = turf.nearestPoint(startMarker.toGeoJSON(), points)
  var nearestEnd = turf.nearestPoint(endMarker.toGeoJSON(), points)
  foundPath = pathFinder.find(createNodeId(nearestStart), createNodeId(nearestEnd))
  drawPath()
}

function drawPath () {
  const pathLatLngs = foundPath.map(function (node) {
    return [node.data.y, node.data.x]
  })
  routeLayer.setLatLngs(pathLatLngs)
}

function createNodeId (p) {
  return p.geometry.coordinates[0] + ',' + p.geometry.coordinates[1]
}

function unhighlightFeature () {
  selectionLayer.clearLayers()
}

export function setGraph (gd) {
  graphData = gd
}

function highlightFeature (e) {
  selectionLayer.clearLayers()

  const node = graphData.getNode(e.target._latlng.lng + ',' + e.target._latlng.lat)

  graphData.forEachLinkedNode(e.target._latlng.lng + ',' + e.target._latlng.lat, function (linkedNode, link) {
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
