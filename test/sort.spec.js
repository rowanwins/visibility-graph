import test from 'ava'
import Point from '../src/Point'
import { sortPoints } from '../src/createGraphFromGeoJson'


// sort the vertices of the obstacle polygons according to the
// counter clock wise angle the half line from v to each vertex makes
// with the x-axis. In the case of ties, vertices closer to v should
// come first.
test('Edge test', t => {
  var p1 = new Point([0, 0], -1)
  var p2 = new Point([-10, -10], -1)
  var p3 = new Point([10, -10], -1)
  var p4 = new Point([10, 10], -1)

  const points = [p1, p2, p3, p4]
  const clonedPoints = points.slice(0)
  sortPoints(p1, clonedPoints)
  console.log(clonedPoints.map(p => p.nodeId))
  t.deepEqual([p2, p3, p4], clonedPoints)
})