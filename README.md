# visibility-graph.js
Visibility graph implementation to support shortest path calculations such as [dijkstra](https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm) or [a-star](https://en.wikipedia.org/wiki/A*_search_algorithm).

### [Demo](https://rowanwins.github.io/visibility-graph/debug/)

## Documentation
Valid inputs: A [polygon](http://geojson.win/#appendix-A.3) or [multi-polygon](http://geojson.win/#appendix-A.6) feature or geometry.

````js
  var out = createGraphFromGeoJson(MultiPolygon)
````
Output is a graph from the [ngraph library](https://github.com/anvaka/ngraph.graph).

**NOTE:** If you get occassional issues with how your edges are being linked try reducing the precision of your coordinates (eg 8 decimal places). 

## Using with other packages
- Once you've created your visibililty graph it is possible to save it, and then load it late, this can be achieved with [ngraph.tojson](https://github.com/anvaka/ngraph.tojson) and [ngraph.fromjson](https://github.com/anvaka/ngraph.fromjson) packages.
- Path finding can be achieved with the [ngraph.path](https://github.com/anvaka/ngraph.path) package.

## Performance
The process of creating a visibility graph can be slow depending on the number of vertices in your input geometry.

| Scenario  | Nodes/Vertices  | Create Graph  | Time Reload Graph / Graph Size  |
| --------- | --------------- | ------------- | ------------------------------- |
| Australia | 250             | 1 second      | 300kb                           |
| Asia      | 1400            | 4 seconds     | 100ms / 5.2MB                   |
| World     | 4400            | 20 seconds    |                                 |

## References & Credits
* Based on [pyvisgraph](https://github.com/TaipanRex/pyvisgraph) and associated blog posts
  * [Distance Tables Part 1: Defining the Problem](https://taipanrex.github.io/2016/09/17/Distance-Tables-Part-1-Defining-the-Problem.html)
  * [Distance Tables Part 2: Lee's Visibility Graph Algorithm](https://taipanrex.github.io/2016/10/19/Distance-Tables-Part-2-Lees-Visibility-Graph-Algorithm.html)
* [Lee's o(n<sup>2</sup> log n) Visibility Graph Algorithm](https://github.com/davetcoleman/visibility_graph/blob/master/Visibility_Graph_Algorithm.pdf) paper by Dave Coleman
* [Intro to path finding](https://www.redblobgames.com/pathfinding/)
  * And specifically a bit about [visibility graphs](https://www.redblobgames.com/pathfinding/visibility-graphs/)
