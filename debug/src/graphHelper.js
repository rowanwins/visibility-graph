import fromjson from 'ngraph.fromjson'
import path from 'ngraph.path'

import Worker from 'worker-loader!./graphCreation.worker.js'

import { setPathFinder, setGraph, clearGraphRelatedData } from './mapHelpers'

export function loadGraphFromFile (filename) {
  function reqListener () {
    const startLoad = window.performance.now()
    const graph = fromjson(this.responseText)
    console.log(graph.getNodesCount())
    const endLoad = window.performance.now()
    const timeTakenToLoad = parseInt(endLoad - startLoad)
    console.log('Time to load: ', timeTakenToLoad)

    setGraph(graph)
    findRouteThroughGraph(graph)
  }
  clearGraphRelatedData()
  var oReq = new XMLHttpRequest() //eslint-disable-line
  oReq.addEventListener('load', reqListener)
  oReq.open('GET', filename)
  oReq.send()
}

export function createGraphFromData (data) {
  clearGraphRelatedData()
  const worker = new Worker() //eslint-disable-line

  const startCreation = window.performance.now()
  worker.postMessage(data)

  worker.onmessage = function (e) {
    const endCreation = window.performance.now()
    const timeTakenToCreate = parseInt(endCreation - startCreation)
    console.log('Time to construct: ', timeTakenToCreate)
    const graph = fromjson(e.data)
    console.log(graph.getNodesCount())
    setGraph(graph)
    findRouteThroughGraph(graph)
  }
}

export function findRouteThroughGraph (graph) {
  const pathFinder = path.nba(graph, {
    distance (fromNode, toNode) {
      const dx = fromNode.data.x - toNode.data.x
      const dy = fromNode.data.y - toNode.data.y
      return Math.sqrt(dx * dx + dy * dy)
    }
  })
  setPathFinder(pathFinder)
}
