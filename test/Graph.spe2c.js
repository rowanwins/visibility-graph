import test from 'ava'
import { Graph } from '../src/Graph'
import { polygon } from './harness/polygon'

test('Graph test', t => {

  var testGraph = new Graph(polygon)
  var blah = testGraph.processGraph()

  t.is(3, 3)
})
