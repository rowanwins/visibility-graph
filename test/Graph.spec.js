import test from 'ava'
import { Graph } from '../src/Graph'

import { polygon } from './harness/polygon'

test('Graph test', t => {

  var testGraph = new Graph(polygon)
  var blah = testGraph.processGraph()
  var out = blah.filter(function (b) {
    return b.point.x === 14.414062499999998 && b.point.y === 12.897489183755892
  })
  console.log(out[0])
  t.is(3, 3)
})
