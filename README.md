# visibility-graph
Visibility graph implementation to support shortest path calculations such as [dijkstra](https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm) or [a-star](https://en.wikipedia.org/wiki/A*_search_algorithm).

### [Demo](https://rowanwins.github.io/visibility-graph/debug/)

## Documentation
Valid inputs: A [polygon](http://geojson.win/#appendix-A.3) or [multi-polygon](http://geojson.win/#appendix-A.6) feature or geometry.

````js
  var out = createGraphFromGeoJson(MultiPolygon)
````
Output is a graph from the [ngraph library](https://github.com/anvaka/ngraph.graph).

## Using with other packages
- Loading and saving your visibililty graph can be achieved with [ngraph.todot](https://github.com/anvaka/ngraph.todot) and [ngraph.fromdot](https://github.com/anvaka/ngraph.fromdot) packages.
- Path finding can be achieved with the [ngraph.path](https://github.com/anvaka/ngraph.path) package.

## To Do
* Test support for multipolygons
* Test support for geometry/feature collections
* Improve tests


## References & Credits
* Based on [pyvisgraph](https://github.com/TaipanRex/pyvisgraph) and associated blog posts
  * [Distance Tables Part 1: Defining the Problem](https://taipanrex.github.io/2016/09/17/Distance-Tables-Part-1-Defining-the-Problem.html)
  * [Distance Tables Part 2: Lee's Visibility Graph Algorithm](https://taipanrex.github.io/2016/10/19/Distance-Tables-Part-2-Lees-Visibility-Graph-Algorithm.html)
* [Lee's o(n<sup>2</sup> log n) Visibility Graph Algorithm](https://github.com/davetcoleman/visibility_graph/blob/master/Visibility_Graph_Algorithm.pdf) paper by Dave Coleman
* [Intro to path finding](https://www.redblobgames.com/pathfinding/)
  * And specifically a bit about [visibility graphs](https://www.redblobgames.com/pathfinding/visibility-graphs/)
