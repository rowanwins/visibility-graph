import test from 'ava'
import Edge from '../src/Edge.js'
import Point from '../src/Point.js'
import EdgeKey from '../src/EdgeKey.js'
import EdgeKeys from '../src/EdgeKeys.js'

test('EdgeKey test', t => {

  const p1 = new Point([0, 0], -1)
  const p2 = new Point([0, 1], -1)
  const p3 = new Point([0, 2], -1)
  const p4 = new Point([0, 0], -1)

  const e1 = new Edge(p1, p2)
  const e2 = new Edge(p3, p4)

  const ek1 = new EdgeKey(p1, p2, e1)
  const ek2 = new EdgeKey(p1, p2, e2)

  const eks = new EdgeKeys()
  t.is(eks.keys.length, 0)

  eks.addKey(ek1)
  eks.addKey(ek1)
  eks.addKey(ek1)
  eks.addKey(ek2)
  t.is(eks.keys.length, 4)

})
