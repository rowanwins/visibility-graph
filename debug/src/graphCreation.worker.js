import VisibilityGraph from '../../src/VisibilityGraph'
var tojson = require('ngraph.tojson')

self.addEventListener('message', function (e) {
  e.data.vg.createGraphFromGeoJson(e.data.d)
  self.postMessage()
}, false)
