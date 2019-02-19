import test from 'ava'
import { setupStructure } from '../src/setupStructure'
import loadJsonFile from 'load-json-file'
import path from 'path'

const poly = loadJsonFile.sync(path.join(__dirname, 'harness', 'polygon.json'))

const edges = []
const points = []
const polygons = []

setupStructure(poly, edges, points, polygons)

test('Polygon has right edges & points length', t => {
  t.is(edges.length, 14)
  t.is(points.length, 14)
  t.is(polygons[0].length, 14)
})

test('Points each have edges', t => {
  for (var i = 0; i < points.length; i++) {
    t.not(points[i].prevPoint, null)
    t.not(points[i].nextPoint, null)
    t.is(points[i].edges.length, 2)
  }
})

const poly2 = loadJsonFile.sync(path.join(__dirname, 'harness', 'multipolygon.json'))

const edges2 = []
const points2 = []
const contours = []

setupStructure(poly2, edges2, points2, contours)

test('MultiPolygon has right edges & points length', t => {
  t.is(edges2.length, 12)
  t.is(points2.length, 12)
  t.is(contours[0].length, 4)
  t.is(contours[1].length, 8)
})

test('MultiPoly - Points each have edges', t => {
  for (var i = 0; i < points2.length; i++) {
    t.not(points2[i].prevPoint, null)
    t.not(points2[i].nextPoint, null)
    t.is(points2[i].edges.length, 2)
  }
})

