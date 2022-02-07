import VisibilityGraph from '../../src/VisibilityGraph'

self.addEventListener('message', function (e) { //eslint-disable-line
  const vg = new VisibilityGraph(e.data.data)
  self.postMessage(vg.saveGraphToJson()) //eslint-disable-line
}, false)
