import test from 'ava'
import VisibilityGraph from '../src/VisibilityGraph.js'
import { loadJsonFileSync } from 'load-json-file'

const poly = loadJsonFileSync('./test/harness/polygon.geojson')
const lengthUniqueCoords = poly.geometry.coordinates[0].length - 1
const vg = new VisibilityGraph(poly)

test('Polygon has right edges & points length', t => {
  t.is(vg._edges.length, 14)
  t.is(vg._points.length, lengthUniqueCoords)
  t.is(vg._polygons[0].edges.length, 14)
})

test('Points each have edges', t => {
  for (let i = 0; i < vg._points.length; i++) {
    t.not(vg._points[i].prevPoint, null)
    t.not(vg._points[i].nextPoint, null)
    t.is(vg._points[i].edges.length, 2)
  }
})

const poly2 = loadJsonFileSync('./test/harness/multipolygon.geojson')
const vg2 = new VisibilityGraph(poly2)

test('MultiPolygon has right edges & points length', t => {
  t.is(vg2._edges.length, 8)
  t.is(vg2._points.length, 8)
  t.is(vg2._polygons[0].edges.length, 4)
  t.is(vg2._polygons[1].edges.length, 4)
})

test('MultiPoly - Points each have edges and next and prev points', t => {
  for (let i = 0; i < vg2._points.length; i++) {
    t.not(vg2._points[i].prevPoint, null)
    t.not(vg2._points[i].nextPoint, null)
    t.is(vg2._points[i].edges.length, 2)
  }
})

test('MultiPoly - edges all have points', t => {
  for (let i = 0; i < vg2._edges.length; i++) {
    t.not(vg2._edges[i].p1, null)
    t.not(vg2._edges[i].p2, null)
  }
})
