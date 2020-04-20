import { processPoint } from './createGraphFromGeoJson'

addEventListener('message', e => {
    const p = e.data.p
    const pointsLen = e.data.pointsLen, 
    const scan = e.data.scan
    const visibilityGraph = e.data.visibilityGraph
    postMessage(processPoint(p, pointsLen, scan, visibilityGraph))
});