
export function _renderSortedPoints (point, sortedPoints) {
  const map = window.map
  var sortedPointsLg = null

  L.NumberedDivIcon = createNumberDiv()

  setCurrentPoint(point)

  if (sortedPointsLg === null) sortedPointsLg = L.layerGroup([]).addTo(map)
  else sortedPointsLg.clearLayers()
  sortedPoints.forEach((p, index) => {
    return L.marker([p.y, p.x], {
      color: 'black',
      icon: new L.NumberedDivIcon({ number: index.toString() })
    }).addTo(sortedPointsLg)
  })

  debugger
}

export function _renderOpenEdges (point, edges) {
  const map = window.map
  const currentPoint = L.circleMarker([point.y, point.x], {
    radius: 20,
    color: 'green'
  }).addTo(map)
  var openEdges = L.layerGroup([]).addTo(map)

  edges.forEach((e, index) => {
    L.polyline([[e.edge.p1.y, e.edge.p1.x], [e.edge.p2.y, e.edge.p2.x]], {
      color: 'red'
    }).addTo(openEdges)
  })

  // debugger
  openEdges.clearLayers()
  map.removeLayer(currentPoint)
}

function setCurrentPoint (point) {
  const map = window.map
  let currentPoint = null

  if (currentPoint !== null) map.removeLayer(currentPoint)

  currentPoint = L.circleMarker([point.y, point.x], {
    radius: 20,
    color: 'green'
  }).addTo(map)

}

function createNumberDiv () {
  return L.Icon.extend({
    options: {
      number: '',
      iconSize: new L.Point(25, 25),
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

