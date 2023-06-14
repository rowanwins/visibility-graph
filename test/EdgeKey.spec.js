import test from 'ava'
import Edge from '../src/Edge.js'
import Point from '../src/Point.js'
import EdgeKey from '../src/EdgeKey.js'

test('EdgeKey test', t => {

  const p1 = new Point([0, 0], -1)
  const p2 = new Point([0, 1], -1)
  const p3 = new Point([0, 2], -1)
  const p4 = new Point([0, 0], -1)

  const e1 = new Edge(p1, p2)
  const e2 = new Edge(p3, p4)

  const ek1 = new EdgeKey(p1, p2, e1)
  const ek1a = new EdgeKey(p1, p2, e1)
  const ek1b = new EdgeKey(p2, p1, e1)

  const ek2 = new EdgeKey(p1, p2, e2)

  t.is(ek1.matchesOtherKey(ek1), true)
  t.is(ek1.matchesOtherKey(ek1a), true)
  t.is(ek1.matchesOtherKey(ek1b), true)
  t.is(ek1.matchesOtherKey(ek2), false)
})

test('EdgeKey less than test', t => {

  const p1 = new Point([3, 1], -1)
  const p2 = new Point([3, 5], -1)
  const p3 = new Point([2, 2], -1)
  const p4 = new Point([4, 4], -1)

  const e1 = new Edge(p1, p2)
  const e2 = new Edge(p3, p4)

  const ek1 = new EdgeKey(p1, p2, e1)
  const ek2 = new EdgeKey(p1, p2, e2)

  t.is(ek1.isLessThanOtherEdgeKey(ek2), true)
  t.is(ek2.isLessThanOtherEdgeKey(ek1), false)

})
