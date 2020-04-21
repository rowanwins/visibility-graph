const path = require('path')
const Benchmark = require('benchmark')
const VisibilityGraph = require('./../dist/visibilityGraph')
const loadJsonFile = require('load-json-file')

const asia = loadJsonFile.sync(path.join(__dirname, 'harness', 'asia.geojson'))

const options = {
  onStart () { console.log(this.name) },
  onError (event) { console.log(event.target.error) },
  onCycle (event) { console.log(String(event.target)) }
}

// Asia Test
// VisibilityGraph x 0.27 ops/sec ±7.56% (5 runs sampled)
// with half scan x 0.40 ops/sec ±2.32% (5 runs sampled)
const suite = new Benchmark.Suite('Asia Test', options)
suite
    .add('VisibilityGraph', function () {
      const vg = new VisibilityGraph()
      vg.createGraphFromGeoJson(asia)
    })
    .run()
