<template>
  <div id="app">
    <div id="map"></div>
  </div>
</template>

<script>
import data from '../../test/harness/asia.geojson'
import { setupMap, setData, setupRouteLayer } from './mapHelpers'
import { loadGraphFromFile, createGraphFromData, createGraphFromDataUsingWorker } from './graphHelper'

const truncatedData = data

export default {
  name: 'app',
  mounted () {
    setupMap()
    setData(truncatedData)
    setupRouteLayer()
    this.createGraph()
  },
  methods: {
    createGraph: function () {
      createGraphFromDataUsingWorker(truncatedData)
    },
    getGraphFile: function () {
      loadGraphFromFile('asia_scenario.json')
    }
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
    background: #EB3223;
    border: 2px solid white;
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

  .leaflet-container {
    background: #13294F;
  }
</style>
