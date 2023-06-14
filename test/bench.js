import { createGraphFromGeoJson } from '../src/createGraphFromGeoJson.js'
import Benchmark from 'benchmark'
import { loadJsonFileSync } from 'load-json-file'
import VisibilityGraph from '../src/VisibilityGraph.js'

// Asia Test
// VisibilityGraph x 0.27 ops/sec ±7.56% (5 runs sampled)
// with half scan x 0.40 ops/sec ±2.32% (5 runs sampled)
new Benchmark.Suite('Asia Test', {
  onStart () {
    console.log(this.name)
  },
  onError (event) {
    console.log(event.target.error)
  },
  onCycle (event) {
    console.log(String(event.target))
  }
})
  .add('VisibilityGraph', () => {
    const asia = loadJsonFileSync('./harness/asia.geojson')
    const vg = new VisibilityGraph(asia)
    createGraphFromGeoJson(vg)
  })
  .run()
