<template>
  <div id="app">
    <div id="map"></div>

  </div>
</template>

<script>
// import { data } from '../../test/harness/continents'
import { aus } from '../../test/harness/australia'
import { createGraphFromGeoJson } from '../../src/main'
const path = require('ngraph.path')

export default {
  name: 'app',
  mounted () {
    var map = window.map = L.map('map', {
      minZoom: 1,
      maxZoom: 20,
      center: [0, 0],
      zoom: 2,
      crs: L.CRS.Simple
    })
    const startMarker = L.marker([-17.9614, 122.2359], {
      draggable: true
    }).addTo(map)

    const endMarker = L.marker([-42.8821, 147.3272], {
      draggable: true
    }).addTo(map)

    startMarker.on('drag', updatePathMarkers)
    endMarker.on('drag', updatePathMarkers)

    function updatePathMarkers () {
      polylineLyr.setLatLngs([])
      var nearestStart = turf.nearestPoint(startMarker.toGeoJSON(), points)
      var nearestEnd = turf.nearestPoint(endMarker.toGeoJSON(), points)
      foundPath = pathFinder.find(createNodeId(nearestStart), createNodeId(nearestEnd))
      drawPath()
    }

    var selectionLayer = L.layerGroup([]).addTo(map)

    function unhighlightFeature () {
      selectionLayer.clearLayers()
    }

    function highlightFeature (e) {
      selectionLayer.clearLayers()

      const node = out.getNode(e.target._latlng.lng + ',' + e.target._latlng.lat)

      out.forEachLinkedNode(e.target._latlng.lng + ',' + e.target._latlng.lat, function (linkedNode, link) {
        L.polyline([[linkedNode.data.y, linkedNode.data.x], [node.data.y, node.data.x]], {
          color: 'green',
          weight: 1
        }).addTo(selectionLayer)
      })
    }

    var polyLayer = L.geoJson(aus, {
      noClip: true
    }).addTo(map)

    map.fitBounds(polyLayer.getBounds(), {
      padding: [20, 20]
    })

    const points = turf.featureCollection([])

    turf.meta.coordEach(aus, function (currentCoord) {
      points.features.push(turf.point([currentCoord[0], currentCoord[1]]))

      var layer = L.circleMarker([currentCoord[1], currentCoord[0]], {
        opacity: 0,
        origPoint: [currentCoord[0], currentCoord[1]]
      }).addTo(map)
      layer.on('mouseover', highlightFeature)
      layer.on('mouseout', unhighlightFeature)

    }, true)

    let out = null
    let foundPath = null
    let pathFinder = null
    const polylineLyr = L.polyline([], {
      color: 'red'
    }).addTo(map)

    function drawPath () {
      const pathLatLngs = foundPath.map(function (node) {
        return [node.data.y, node.data.x]
      })
      polylineLyr.setLatLngs(pathLatLngs)
    }

    function createNodeId (p) {
      return p.geometry.coordinates[0] + ',' + p.geometry.coordinates[1]
    }

    setTimeout(function () {
      console.time('visgraph')
      out = createGraphFromGeoJson(aus)
      console.timeEnd('visgraph')

      pathFinder = path.nba(out, {
        distance (fromNode, toNode) {
          const dx = fromNode.data.x - toNode.data.x
          const dy = fromNode.data.y - toNode.data.y
          return Math.sqrt(dx * dx + dy * dy)
        }
      })
      updatePathMarkers()
      drawPath()
    }, 400)
  }
}
</script>

<style>
    html, body, #app, #map {
      width: 100%;
      height: 100%;
      margin: 0px;
    }

  .leaflet-div-icon {
    background: white;
    border: 2px solid;
    border-radius:  60%;
  }

  .leaflet-marker-icon .number{
    position: relative;
    top: 4px;
    font-size: 12px;
    width: 2 6px;
    height: 2 6px;
    text-align: center;
  }
</style>
