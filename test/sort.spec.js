import test from 'ava'
import Point from '../src/Point.js'
import { sortPoints } from '../src/createGraphFromGeoJson.js'

// sort the vertices of the obstacle polygons according to the
// counter clock wise angle the half line from v to each vertex makes
// with the x-axis. In the case of ties, vertices closer to v should
// come first.
test('Edge test', t => {
  const p1 = new Point([0, 0], -1)
  const p2 = new Point([-10, -10], -1)
  const p3 = new Point([10, -10], -1)
  const p4 = new Point([10, 10], -1)

  const points = [p1, p2, p3, p4]
  const clonedPoints = points.slice(0)
  sortPoints(p1, clonedPoints)
  // expected is counter-clockwise so p4 is the first point then p2, p3
  t.deepEqual([p1, p4, p2, p3], clonedPoints)
})
