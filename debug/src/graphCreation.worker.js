import { createGraphFromGeoJson } from '../../src/main'
var tojson = require('ngraph.tojson')

self.addEventListener('message', function (e) {
  const outGraph = createGraphFromGeoJson(e.data)
  const jsonContent = tojson(outGraph)

  self.postMessage(jsonContent)
}, false)
