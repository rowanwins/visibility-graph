import pyvisgraph as vg
polys = [[vg.Point(0.0,1.0), vg.Point(3.0,1.0), vg.Point(4.5, 2),
          vg.Point(4.0,4.0), vg.Point(7.0,4.0), vg.Point(5.5,8.0)]]
g = vg.VisGraph()
g.build(polys)
print g.visgraph 