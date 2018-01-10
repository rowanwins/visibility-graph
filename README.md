# visibility-graph
Visibility graph implementation to support shortest path calculations such as [dijkstra](https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm) or [a-star](https://en.wikipedia.org/wiki/A*_search_algorithm).

### [Demo](https://rowanwins.github.io/visibility-graph/index.html)
W
## Documentation
Valid inputs: Geojson polygon

````js
  var vg = new Graph(polygon)
  var out = vg.processGraph()
````

## Warning 
This is very much an alpha version - the API may change without warning.


## To Do
* Test support for multipolygons
* Test support for lines/multi-lines
* Test support for geometry/feature collections
* Support adding new features to the graph
* Improve tests


## References & Credits
* Based on [pyvisgraph](https://github.com/TaipanRex/pyvisgraph) and associated blog posts
  * [Distance Tables Part 1: Defining the Problem](https://taipanrex.github.io/2016/09/17/Distance-Tables-Part-1-Defining-the-Problem.html)
  * [Distance Tables Part 2: Lee's Visibility Graph Algorithm](https://taipanrex.github.io/2016/10/19/Distance-Tables-Part-2-Lees-Visibility-Graph-Algorithm.html)
* [Lee's o(n<sup>2</sup> log n) Visibility Graph Algorithm](https://github.com/davetcoleman/visibility_graph/blob/master/Visibility_Graph_Algorithm.pdf) paper by Dave Coleman
* [Intro to path finding](https://www.redblobgames.com/pathfinding/)
  * And specifically a bit about [visibiilty graphs](https://www.redblobgames.com/pathfinding/visibility-graphs/)