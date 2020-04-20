import test from 'ava'
import VisibilityGraph from '../src/VisibilityGraph'
import { setupStructure } from '../src/setupStructure'
import loadJsonFile from 'load-json-file'
import path from 'path'

const poly = loadJsonFile.sync(path.join(__dirname, 'harness', 'polygon.geojson'))
const lengthUniqueCoords = poly.geometry.coordinates[0].length - 1
const vg = new VisibilityGraph()

setupStructure(vg, poly)

test('Polygon has right edges & points length', t => {
  t.is(vg._edges.length, 14)
  t.is(vg._points.length, lengthUniqueCoords)
  t.is(vg._polygons[0].edges.length, 14)
})

test('Points each have edges', t => {
  for (var i = 0; i < vg._points.length; i++) {
    t.not(vg._points[i].prevPoint, null)
    t.not(vg._points[i].nextPoint, null)
    t.is(vg._points[i].edges.length, 2)
  }
})

const poly2 = loadJsonFile.sync(path.join(__dirname, 'harness', 'multipolygon.geojson'))
const vg2 = new VisibilityGraph()

setupStructure(vg2, poly2)

test('MultiPolygon has right edges & points length', t => {
  t.is(vg2._edges.length, 12)
  t.is(vg2._points.length, 12)
  t.is(vg2._polygons[0].edges.length, 4)
  t.is(vg2._polygons[1].edges.length, 8)
})

test('MultiPoly - Points each have edges and next and prev points', t => {
  for (var i = 0; i < vg2._points.length; i++) {
    t.not(vg2._points[i].prevPoint, null)
    t.not(vg2._points[i].nextPoint, null)
    t.is(vg2._points[i].edges.length, 2)
  }
})

test('MultiPoly - edges all have points', t => {
  for (var i = 0; i < vg2._edges.length; i++) {
    t.not(vg2._edges[i].p1, null)
    t.not(vg2._edges[i].p2, null)
  }
})
