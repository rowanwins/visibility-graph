import test from 'ava'
import Edge from '../src/Edge'
import Point from '../src/Point'
import EdgeKey from '../src/EdgeKey'
import EdgeKeys from '../src/EdgeKeys'

test('EdgeKey test', t => {

  var p1 = new Point([0, 0], -1)
  var p2 = new Point([0, 1], -1)
  var p3 = new Point([0, 2], -1)
  var p4 = new Point([0, 0], -1)

  var e1 = new Edge(p1, p2)
  var e2 = new Edge(p3, p4)

  var ek1 = new EdgeKey(p1, p2, e1)
  var ek2 = new EdgeKey(p1, p2, e2)

  var eks = new EdgeKeys()
  t.is(eks.keys.length, 0)

  eks.addKey(ek1)
  eks.addKey(ek1)
  eks.addKey(ek1)
  eks.addKey(ek2)
  t.is(eks.keys.length, 4)

})
