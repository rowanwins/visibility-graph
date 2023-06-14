import test from 'ava'
import Edge from '../src/Edge.js'
import Point from '../src/Point.js'

test('Edge test', t => {

  const p1 = new Point([0, 0], -1)
  const p2 = new Point([0, 1], -1)
  const p3 = new Point([0, 2], -1)
  const p4 = new Point([0, 0], -1)
  const p5 = new Point([0, 1], -1)

  const e1 = new Edge(p1, p2)
  const e1a = new Edge(p2, p1)
  const e2 = new Edge(p3, p4)
  const e2a = new Edge(p5, p4)

  t.is(e1.areEdgesEqual(e1a), true)
  t.is(e2a.areEdgesEqual(e1), true)
  t.is(e1.areEdgesEqual(e1), true)
  t.is(e1.areEdgesEqual(e2), false)

  t.is(e1.containsPoint(p1), true)
  t.is(e1.containsPoint(p2), true)
  t.is(e1.containsPoint(p3), false)

  t.is(e1.getOtherPointInEdge(p1), p2)
  t.is(e1.getOtherPointInEdge(p2), p1)

})
