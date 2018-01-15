(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.vg = global.vg || {})));
}(this, (function (exports) { 'use strict';

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

/**
 * Earth Radius used with the Harvesine formula and approximates using a spherical (non-ellipsoid) Earth.
 */

/**
 * Callback for coordEach
 *
 * @callback coordEachCallback
 * @param {Array<number>} currentCoord The current coordinate being processed.
 * @param {number} coordIndex The current index of the coordinate being processed.
 * @param {number} featureIndex The current index of the Feature being processed.
 * @param {number} multiFeatureIndex The current index of the Multi-Feature being processed.
 * @param {number} geometryIndex The current index of the Geometry being processed.
 */

/**
 * Iterate over coordinates in any GeoJSON object, similar to Array.forEach()
 *
 * @name coordEach
 * @param {FeatureCollection|Feature|Geometry} geojson any GeoJSON object
 * @param {Function} callback a method that takes (currentCoord, coordIndex, featureIndex, multiFeatureIndex)
 * @param {boolean} [excludeWrapCoord=false] whether or not to include the final coordinate of LinearRings that wraps the ring in its iteration.
 * @returns {void}
 * @example
 * var features = turf.featureCollection([
 *   turf.point([26, 37], {"foo": "bar"}),
 *   turf.point([36, 53], {"hello": "world"})
 * ]);
 *
 * turf.coordEach(features, function (currentCoord, coordIndex, featureIndex, multiFeatureIndex, geometryIndex) {
 *   //=currentCoord
 *   //=coordIndex
 *   //=featureIndex
 *   //=multiFeatureIndex
 *   //=geometryIndex
 * });
 */
function coordEach(geojson, callback, excludeWrapCoord) {
    // Handles null Geometry -- Skips this GeoJSON
    if (geojson === null) return;
    var j,
        k,
        l,
        geometry$$1,
        stopG,
        coords,
        geometryMaybeCollection,
        wrapShrink = 0,
        coordIndex = 0,
        isGeometryCollection,
        type = geojson.type,
        isFeatureCollection = type === 'FeatureCollection',
        isFeature = type === 'Feature',
        stop = isFeatureCollection ? geojson.features.length : 1;

    // This logic may look a little weird. The reason why it is that way
    // is because it's trying to be fast. GeoJSON supports multiple kinds
    // of objects at its root: FeatureCollection, Features, Geometries.
    // This function has the responsibility of handling all of them, and that
    // means that some of the `for` loops you see below actually just don't apply
    // to certain inputs. For instance, if you give this just a
    // Point geometry, then both loops are short-circuited and all we do
    // is gradually rename the input until it's called 'geometry'.
    //
    // This also aims to allocate as few resources as possible: just a
    // few numbers and booleans, rather than any temporary arrays as would
    // be required with the normalization approach.
    for (var featureIndex = 0; featureIndex < stop; featureIndex++) {
        geometryMaybeCollection = isFeatureCollection ? geojson.features[featureIndex].geometry : isFeature ? geojson.geometry : geojson;
        isGeometryCollection = geometryMaybeCollection ? geometryMaybeCollection.type === 'GeometryCollection' : false;
        stopG = isGeometryCollection ? geometryMaybeCollection.geometries.length : 1;

        for (var geomIndex = 0; geomIndex < stopG; geomIndex++) {
            var multiFeatureIndex = 0;
            var geometryIndex = 0;
            geometry$$1 = isGeometryCollection ? geometryMaybeCollection.geometries[geomIndex] : geometryMaybeCollection;

            // Handles null Geometry -- Skips this geometry
            if (geometry$$1 === null) continue;
            coords = geometry$$1.coordinates;
            var geomType = geometry$$1.type;

            wrapShrink = excludeWrapCoord && (geomType === 'Polygon' || geomType === 'MultiPolygon') ? 1 : 0;

            switch (geomType) {
                case null:
                    break;
                case 'Point':
                    if (callback(coords, coordIndex, featureIndex, multiFeatureIndex, geometryIndex) === false) return false;
                    coordIndex++;
                    multiFeatureIndex++;
                    break;
                case 'LineString':
                case 'MultiPoint':
                    for (j = 0; j < coords.length; j++) {
                        if (callback(coords[j], coordIndex, featureIndex, multiFeatureIndex, geometryIndex) === false) return false;
                        coordIndex++;
                        if (geomType === 'MultiPoint') multiFeatureIndex++;
                    }
                    if (geomType === 'LineString') multiFeatureIndex++;
                    break;
                case 'Polygon':
                case 'MultiLineString':
                    for (j = 0; j < coords.length; j++) {
                        for (k = 0; k < coords[j].length - wrapShrink; k++) {
                            if (callback(coords[j][k], coordIndex, featureIndex, multiFeatureIndex, geometryIndex) === false) return false;
                            coordIndex++;
                        }
                        if (geomType === 'MultiLineString') multiFeatureIndex++;
                        if (geomType === 'Polygon') geometryIndex++;
                    }
                    if (geomType === 'Polygon') multiFeatureIndex++;
                    break;
                case 'MultiPolygon':
                    for (j = 0; j < coords.length; j++) {
                        if (geomType === 'MultiPolygon') geometryIndex = 0;
                        for (k = 0; k < coords[j].length; k++) {
                            for (l = 0; l < coords[j][k].length - wrapShrink; l++) {
                                if (callback(coords[j][k][l], coordIndex, featureIndex, multiFeatureIndex, geometryIndex) === false) return false;
                                coordIndex++;
                            }
                            geometryIndex++;
                        }
                        multiFeatureIndex++;
                    }
                    break;
                case 'GeometryCollection':
                    for (j = 0; j < geometry$$1.geometries.length; j++) {
                        if (coordEach(geometry$$1.geometries[j], callback, excludeWrapCoord) === false) return false;
                    }break;
                default:
                    throw new Error('Unknown Geometry Type');
            }
        }
    }
}

var Edge = function () {
  function Edge(p1, p2, polygonID) {
    classCallCheck(this, Edge);

    this.p1 = p1;
    this.p2 = p2;
  }

  createClass(Edge, [{
    key: "getOtherPointInEdge",
    value: function getOtherPointInEdge(point) {
      return this.p1.isPointEqual(point) ? this.p2 : this.p1;
    }
  }, {
    key: "areEdgesEquals",
    value: function areEdgesEquals(otherEdge) {
      if (this.p1 === otherEdge.p1 && this.p2 === otherEdge.p2) return true;
      if (this.p12 === otherEdge.p1 && this.p1 === otherEdge.p2) return true;
      return false;
    }
  }, {
    key: "containsPoint",
    value: function containsPoint(point) {
      if (this.p1.isPointEqual(point) || this.p2.isPointEqual(point)) return true;
      return false;
    }
  }]);
  return Edge;
}();

var EdgeKeys = function () {
  function EdgeKeys() {
    classCallCheck(this, EdgeKeys);

    this.keys = [];
  }

  createClass(EdgeKeys, [{
    key: "findKeyPosition",
    value: function findKeyPosition(edgekey) {
      var lo = 0;
      var hi = this.keys.length;
      while (lo < hi) {
        var mid = Math.floor((lo + hi) / 2);
        if (edgekey.isLessThanOtherEdgeKey(this.keys[mid])) hi = mid;else lo = mid + 1;
      }
      return lo;
    }
  }, {
    key: "addKey",
    value: function addKey(edgekey) {
      var lo = this.findKeyPosition(edgekey);
      this.keys.splice(lo, 0, edgekey);
    }
  }]);
  return EdgeKeys;
}();

var Point = function () {
  function Point(x, y, polygonID) {
    classCallCheck(this, Point);

    if (polygonID === undefined) polygonID = -1;
    this.x = x;
    this.y = y;
    this.polygonID = polygonID;
  }

  createClass(Point, [{
    key: 'isPointEqual',
    value: function isPointEqual(otherPoint) {
      return this.x && otherPoint.x && this.y === otherPoint.y;
    }
  }, {
    key: 'angleToPoint',
    value: function angleToPoint(otherPoint) {
      if (this.x === otherPoint.x && this.y === otherPoint.y) return 0;
      var dx = otherPoint.x - this.x;
      var dy = otherPoint.y - this.y;
      if (dx === 0) dy < 1 ? pi1 : pi2;
      if (dy === 0) dx < 0 ? Math.PI : 0;
      if (dx < 0) return Math.PI + Math.atan(dy / dx);
      if (dy < 0) return 2 * Math.PI + Math.atan(dy / dx);
      return Math.atan(dy / dx);
    }
  }, {
    key: 'edgeDistance',
    value: function edgeDistance$$1(otherPoint) {
      return edgeDistance(this, otherPoint);
    }
  }]);
  return Point;
}();

var pi1 = Math.PI * 3 / 2;
var pi2 = Math.PI / 2;

var INF = 10000;
var COLIN_TOLERANCE = 13;
var T = Math.pow(10, COLIN_TOLERANCE);
var T2 = Math.pow(10.0, COLIN_TOLERANCE);

function edgeIntersect(p1, q1, edge) {
  var p2 = edge.p1;
  var q2 = edge.p2;
  var o1 = ccw(p1, q1, p2);
  var o2 = ccw(p1, q1, q2);
  var o3 = ccw(p2, q2, p1);
  var o4 = ccw(p2, q2, q1);
  if (o1 !== o2 && o3 !== o4) return true;
  if (o1 === 0 && onSegment(p1, p2, q1)) return true;
  if (o2 === 0 && onSegment(p1, q2, q1)) return true;
  if (o3 === 0 && onSegment(p2, p1, q2)) return true;
  if (o4 === 0 && onSegment(p2, q1, q2)) return true;
  return false;
}

function ccw(a, b, c) {
  var area = parseInt(((b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x)) * T) / T2;
  if (area > 0) return 1;
  if (area < 0) return -1;
  return 0;
}

function onSegment(p, q, r) {
  if (q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x)) {
    if (q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y)) return true;
  }
  return false;
}

function angle2(p1, p2, p3) {
  var a = Math.pow(p3.x - p2.x, 2) + Math.pow(p3.y - p2.y, 2);
  var b = Math.pow(p3.x - p1.x, 2) + Math.pow(p3.y - p1.y, 2);
  var c = Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2);
  return Math.acos((a + c - b) / (2 * Math.sqrt(a) * Math.sqrt(c)));
}

function pointEdgeDistance(p1, p2, edge) {
  var ip = intersectPoint(p1, p2, edge);
  return ip !== null ? edgeDistance(p1, ip) : 0;
}

function intersectPoint(p1, p2, edge) {
  if (edge.containsPoint(p1)) return p1;
  if (edge.containsPoint(p2)) return p2;
  if (edge.p1.x === edge.p2.px) {
    if (p1.x === p2.x) return null;
    var _pslope = (p1.y - p2.y) / (p1.x - p2.x);
    var _intersectX = edge.p1.x;
    var _intersectY = _pslope * (_intersectX - p1.x) + p1.y;
    return new Point(_intersectX, _intersectY);
  }
  if (p1.x === p2.x) {
    var _eslope = (edge.p1.y - edge.p2.y) / (edge.p1.x - edge.p2.x);
    var _intersectX2 = edge.p1.x;
    var _intersectY2 = _eslope * (_intersectX2 - edge.p1.x) + edge.p1.y;
    return new Point(_intersectX2, _intersectY2);
  }
  var pslope = (p1.y - p2.y) / (p1.x - p2.x);
  var eslope = (edge.p1.y - edge.p2.y) / (edge.p1.x - edge.p2.x);
  if (pslope === eslope) return null;
  var intersectX = (eslope * edge.p1.x - pslope * p1.x + p1.y - edge.p1.y) / (eslope - pslope);
  var intersectY = eslope * (intersectY - edge.p1.x) + edge.p1.y;
  return new Point(intersectX, intersectY);
}

function edgeDistance(p1, p2) {
  return Math.sqrt((p2.x - p1.x) * 2 + (p2.y - p1.y) * 2);
}

var EdgeKey = function () {
  function EdgeKey(p1, p2, edge) {
    classCallCheck(this, EdgeKey);

    this.p1 = p1;
    this.p2 = p2;
    this.edge = edge;
  }

  createClass(EdgeKey, [{
    key: 'isLessThanOtherEdgeKey',
    value: function isLessThanOtherEdgeKey(otherEdgeKey) {
      if (this.edge === otherEdgeKey.edge) return false;
      if (!edgeIntersect(this.p1, this.p2, otherEdgeKey.edge)) return true;
      var selfDistance = pointEdgeDistance(this.p1, this.p2, this.edge);
      var otherDistance = pointEdgeDistance(this.p1, this.p2, otherEdgeKey.edge);
      if (selfDistance > otherDistance) return false;
      if (selfDistance < otherDistance) return true;
      if (selfDistance === otherDistance) {
        var samePoint = null;
        if (otherEdgeKey.edge.containsPoint(this.edge.p1)) samePoint = this.edge.p1;else if (otherEdgeKey.edge.containsPoint(this.edge.p2)) samePoint = this.edge.p2;
        var aslf = angle2(this.p1, this.p2, this.edge.getOtherPointInEdge(samePoint));
        var aot = angle2(this.p1, this.p2, otherEdgeKey.edge.getOtherPointInEdge(samePoint));
        if (aslf < aot) return true;
        return false;
      }
    }
  }, {
    key: 'matchesOtherKey',
    value: function matchesOtherKey(otherKey) {
      return this.edge.areEdgesEquals(otherKey.edge);
    }
  }]);
  return EdgeKey;
}();

var currentPoint = null;
var openEdges = null;
var map = null;



function _renderOpenEdges(point, edges) {
  if (map === null) map = window.map;
  setCurrentPoint(point);

  if (openEdges === null) openEdges = L.layerGroup([]).addTo(map);else openEdges.clearLayers();

  edges.forEach(function (e, index) {
    L.polyline([[e.edge.p1.y, e.edge.p1.x], [e.edge.p2.y, e.edge.p2.x]], {
      color: 'red'
    }).addTo(openEdges);
  });

  debugger;
}

function setCurrentPoint(point) {
  if (currentPoint !== null) map.removeLayer(currentPoint);
  currentPoint = L.circleMarker([point.y, point.x], {
    radius: 20,
    color: 'green'
  }).addTo(map);
}

L.NumberedDivIcon = L.Icon.extend({
  options: {
    number: '',
    iconSize: new L.Point(25, 25),
    className: 'leaflet-div-icon'
  },

  createIcon: function createIcon() {
    var div = document.createElement('div');
    var numdiv = document.createElement('div');
    numdiv.setAttribute('class', 'number');
    numdiv.innerHTML = this.options['number'] || '';
    div.appendChild(numdiv);
    this._setIconStyles(div, 'icon');
    return div;
  }
});

var Graph = function () {
  function Graph(polygons) {
    classCallCheck(this, Graph);

    this.points = [];
    this.edges = [];
    this.vg = [];

    var prevGeomIndex = 0;
    var subtractCoordIndex = 0;

    var g = this;
    coordEach(polygons, function (currentCoord, coordIndex, featureIndex, multiFeatureIndex, geometryIndex) {

      if (geometryIndex > prevGeomIndex) {
        prevGeomIndex = geometryIndex;
        subtractCoordIndex = coordIndex;
      }
      var nextCoordIndex = coordIndex - subtractCoordIndex + 1;
      if (nextCoordIndex === polygons.features[featureIndex].geometry.coordinates[geometryIndex].length) nextCoordIndex = 0;

      var nextPoint = polygons.features[featureIndex].geometry.coordinates[geometryIndex][nextCoordIndex];
      var p1 = new Point(currentCoord[0], currentCoord[1], geometryIndex);
      var p2 = new Point(nextPoint[0], nextPoint[1], geometryIndex);

      g.edges.push(new Edge(p1, p2));
      g.points.push(p1);
    }, true);
  }

  createClass(Graph, [{
    key: 'processGraph',
    value: function processGraph() {
      var allVisible = [];
      for (var i = 0; i < this.points.length; i++) {
        var p = this.points[i];

        this.sortPoints(p);

        // _renderSortedPoints(p, this.points)

        var openEdges = new EdgeKeys();
        var pointInf = new Point(INF, p.y);
        for (var ii = 0; ii < this.edges.length; ii++) {
          var e = this.edges[ii];
          if (e.containsPoint(p)) continue;
          if (edgeIntersect(p, pointInf, e)) {
            if (onSegment(p, e.p1, pointInf) || onSegment(p, e.p2, pointInf)) continue;
            openEdges.addKey(new EdgeKey(p, pointInf, e));
          }
        }
        _renderOpenEdges(p, openEdges.keys);

        var visible = [];
        var prev = null;
        var prevVisible = null;
        for (var _ii = 0; _ii < this.points.length; _ii++) {
          var p2 = this.points[_ii];
          if (p2 === p) continue;
          if (openEdges.keys.length > 0) {
            for (var iii = 0; iii < this.edges.length; iii++) {
              var _e = this.edges[iii];
              if (ccw(p, p2, _e.getOtherPointInEdge(p2)) === -1) {
                var k = new EdgeKey(p, p2, _e);
                var index = openEdges.findKeyPosition(k) - 1;
                if (index < 0) continue;
                if (openEdges.keys.length > 0 && openEdges.keys[index].matchesOtherKey(k)) {
                  openEdges.keys.splice(index, 1);
                }
              }
            }
          }
          var isVisible = false;
          if (prev === null || ccw(p, prev, p2) !== 0 || !onSegment(p, prev, p2)) {
            if (openEdges.keys.length === 0) {
              isVisible = true;
            } else if (!edgeIntersect(p, p2, openEdges.keys[0].edge)) {
              isVisible = true;
            }
          } else if (!prevVisible) {
            isVisible = false;
          } else {
            isVisible = true;
            for (var _iii = 0; _iii < openEdges.keys.length; _iii++) {
              var _e2 = openEdges.keys[_iii];
              if (!_e2.edge.containsPoint(prev) && edgeIntersect(prev, p2, _e2.edge)) {
                isVisible = false;
                break;
              }
            }
            if (isVisible && this.edgeInPolygon(prev, p2)) isVisible = false;
          }

          var prevPoint = _ii === 0 ? this.points[this.points.length - 1] : this.points[_ii - 1];
          var nextPoint = _ii < this.points.length - 1 ? this.points[_ii + 1] : this.points[0];

          // if (p.x === 14.414062499999998 && p.y === 12.897489183755892) console.log(prevPoint, nextPoint)
          if (isVisible && (!p2.isPointEqual(prevPoint) || !p2.isPointEqual(nextPoint))) isVisible = !this.edgeInPolygon(p, p2);

          if (isVisible) visible.push(p2);

          for (var _iii2 = 0; _iii2 < this.edges.length; _iii2++) {
            var _e3 = this.edges[_iii2];
            if (!_e3.containsPoint(p) && ccw(p, p2, _e3.getOtherPointInEdge(p2)) === 1) {
              var _k = new EdgeKey(p, p2, _e3);
              openEdges.addKey(_k);
            }
          }

          prev = p2;
          prevVisible = isVisible;
        }
        allVisible.push({
          point: p,
          otherVis: visible
        });
      }
      return allVisible;
    }
  }, {
    key: 'copyPoints',
    value: function copyPoints() {
      return this.points.slice(0);
    }
  }, {
    key: 'sortPoints',
    value: function sortPoints(point) {
      this.points.sort(function (a, b) {
        var angle1 = point.angleToPoint(a);
        var angle2$$1 = point.angleToPoint(b);
        if (angle1 < angle2$$1) return -1;
        if (angle1 > angle2$$1) return 1;
        var dist1 = edgeDistance(a, point);
        var dist2 = edgeDistance(b, point);
        if (dist1 < dist2) return -1;
        if (dist1 > dist2) return 1;
        return 0;
      });
    }
  }, {
    key: 'edgeInPolygon',
    value: function edgeInPolygon(p1, p2) {
      if (p1.polygonID !== p2.polygonID) return false;
      if (p1.polygonID === -1 || p2.polygonID === -1) return false;
      var midPoint = new Point((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
      return this.polygonCrossing(midPoint, this.edges);
    }
  }, {
    key: 'polygonCrossing',
    value: function polygonCrossing(p1, polyEdges) {
      var p2 = new Point(INF, p1.y);
      var intersectCount = 0;
      var coFlag = false;
      var coDir = 0;
      for (var i = 0; i < polyEdges.length; i++) {
        var e = polyEdges[i];
        if (p1.y < e.p1.y && p1.y < e.p2.y) continue;
        if (p1.y > e.p1.y && p1.y < e.p2.y) continue;
        var co0 = ccw(p1, e.p1, p2) === 0 && e.p1.x > p1.x;
        var co1 = ccw(p1, e.p2, p2) === 0 && e.p2.x > p1.x;
        var coPoint = co0 ? e.p1 : e.p2;
        if (co0 || co1) {
          coDir = e.getOtherPointInEdge(coPoint).y > p1.y ? coDir++ : coDir--;
          if (coFlag) {
            if (coDir === 0) intersectCount++;
            coFlag = false;
            coDir = 0;
          } else {
            coFlag = true;
          }
        } else if (edgeIntersect(p1, p2, e)) {
          intersectCount++;
        }
      }
      if (intersectCount / 2 === 0) return false;
      return true;
    }
  }]);
  return Graph;
}();

exports.Graph = Graph;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=vg.js.map
