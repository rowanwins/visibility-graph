<template>
  <div id="app">
    <div id="map"></div>

  </div>
</template>

<script>

import { polygon } from '../test/harness/polygon'
import { polygonCollection } from '../test/harness/polygonCollection'
import { linestring } from '../test/harness/linestring'
import { Graph } from '../src/main'
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
    var selectionLayer = L.layerGroup([]).addTo(map)

    function highlightFeature (e) {
      selectionLayer.clearLayers()
      out.forEach(p => {
        if (p.point.x === e.target.options.origPoint[0] && p.point.y === e.target.options.origPoint[1]) {
          p.otherVis.forEach(op => {
            L.polyline([[op.y, op.x], [p.point.y, p.point.x]], {
              color: 'red',
              weight: 1
            }).addTo(selectionLayer)
          })
        }
      })
    }

    var polyLayer = L.geoJson(polygonCollection).addTo(map)
    map.fitBounds(polyLayer.getBounds(), {
      padding: [20, 20]
    })

    turf.meta.coordEach(polygonCollection, function (currentCoord) {
      var layer = L.circleMarker([currentCoord[1], currentCoord[0]], {
        opacity: 0,
        origPoint: [currentCoord[0], currentCoord[1]]
      }).addTo(map)
      layer.on('mouseover', highlightFeature)
    }, true)
    var out = null
    setTimeout(function () {
      console.time('visgraph')
      var vg = new Graph(polygonCollection)
      console.log(vg)
      out = vg.processGraph()
      // console.log(out)
      console.timeEnd('visgraph')      
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
