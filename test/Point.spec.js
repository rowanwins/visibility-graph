import test from 'ava'
import Point from '../src/Point.js'

test('Point constructor test', t => {

  const p1 = new Point([0, 0], -1)
  const p1a = new Point([0, 0], -1)
  const p2 = new Point([0, 1], -1)

  t.is(p1.isPointEqual(p1a), true)
  t.is(p1.isPointEqual(p2), false)

})

test('Point - angle to point tests', t => {

  const center = new Point([1, 1], -1)
  const p1 = new Point([3, 1], -1)
  const p2 = new Point([1, 0], -1)

  t.is(center.angleToPoint(p1), 0)
  // t.is(center.angleToPoint(p2), Math.PI * 3 / 2)

})
