import test from 'ava'
import { Edge } from '../src/Edge'
import { Point } from '../src/Point'
import { EdgeKey } from '../src/EdgeKey'

test('EdgeKey test', t => {

  var p1 = new Point([0, 0], -1)
  var p2 = new Point([0, 1], -1)
  var p3 = new Point([0, 2], -1)
  var p4 = new Point([0, 0], -1)

  var e1 = new Edge(p1, p2)
  var e2 = new Edge(p3, p4)

  var ek1 = new EdgeKey(p1, p2, e1)
  var ek1a = new EdgeKey(p1, p2, e1)
  var ek1b = new EdgeKey(p2, p1, e1)

  var ek2 = new EdgeKey(p1, p2, e2)

  t.is(ek1.matchesOtherKey(ek1), true)
  t.is(ek1.matchesOtherKey(ek1a), true)
  t.is(ek1.matchesOtherKey(ek1b), true)
  t.is(ek1.matchesOtherKey(ek2), false)
})

test('EdgeKey less than test', t => {

  var p1 = new Point([3, 1])
  var p2 = new Point([3, 5])
  var p3 = new Point([2, 2])
  var p4 = new Point([4, 4])

  var e1 = new Edge(p1, p2)
  var e2 = new Edge(p3, p4)

  var ek1 = new EdgeKey(p1, p2, e1)
  var ek2 = new EdgeKey(p1, p2, e2)

  t.is(ek1.isLessThanOtherEdgeKey(ek2), true)
  t.is(ek2.isLessThanOtherEdgeKey(ek1), false)

})
