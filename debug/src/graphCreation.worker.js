import VisibilityGraph from '../../src/VisibilityGraph'
var tojson = require('ngraph.tojson')

self.addEventListener('message', function (e) {
  const vg = new VisibilityGraph()
  vg.createGraphFromGeoJson(e.data.data)
  self.postMessage(tojson(vg.graph))
}, false)
