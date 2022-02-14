import fromjson from 'ngraph.fromjson'
import path from 'ngraph.path'
import VisibilityGraph from '../../src/VisibilityGraph'

import Worker from './graphCreation.worker.js?worker'

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

  const startCreation = window.performance.now()
  const vg = new VisibilityGraph(data)
  const endCreation = window.performance.now()
  const timeTakenToCreate = parseInt(endCreation - startCreation)
  console.log('Time to construct: ', timeTakenToCreate)
  setGraph(vg)
  findRouteThroughGraph(vg.graph)
}

export function createGraphFromDataUsingWorker (data) {
  clearGraphRelatedData()

  const startCreation = window.performance.now()
  const worker = new Worker() //eslint-disable-line
  worker.postMessage({ data: data })
  worker.onmessage = function (e) {
    const endCreation = window.performance.now()
    const timeTakenToCreate = parseInt(endCreation - startCreation)
    console.log('Time to construct: ', timeTakenToCreate)
    const vg = new VisibilityGraph(data, e.data)
    setGraph(vg)
    findRouteThroughGraph(vg.graph)
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
