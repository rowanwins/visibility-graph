<template>
  <div id="app">
    <div id="map"></div>

  </div>
</template>

<script>

import { polygon } from '../test/harness/polygon'
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
    var polyLayer = L.geoJson(polygon).addTo(map)
    map.fitBounds(polyLayer.getBounds(), {
      padding: [20, 20]
    })

    setTimeout(function () {
      var vg = new Graph(polygon)
      console.log(vg)
      // L.marker([vg.points[0].y, vg.points[0].x]).addTo(map)
      // L.marker([vg.points[0].edges[0].p2.y, vg.points[0].edges[0].p2.x]).addTo(map)

      // L.marker([vg.points[0].edges[1].p1.y, vg.points[0].edges[1].p1.x]).addTo(map)
      var out = vg.processGraph()
      // console.log(out)

      // Show output of first Marker
      // L.circleMarker([out[0].point.y, out[0].point.x]).addTo(map)
      // out[0].otherVis.forEach(op => {
      //   L.circleMarker([op.y, op.x], {
      //     color: 'red'
      //   }).addTo(map)
      // })
    }, 1000)
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
    border-radius: 50%;
  }

  .leaflet-marker-icon .number{
    position: relative;
    top: 4px;
    font-size: 12px;
    width: 25px;
    height: 25px;
    text-align: center;
  }
</style>
