export class EdgeKeys {

  constructor () {
    this.keys = []
  }

  findKeyPosition (edgekey) {
    let lo = 0
    let hi = this.keys.length
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2)
      if (edgekey.isLessThanOtherEdgeKey(this.keys[mid])) hi = mid
      else lo = mid + 1
    }
    return lo
  }

  addKey (edgekey) {
    const lo = this.findKeyPosition(edgekey)
    this.keys.splice(lo, 0, edgekey)
  }

}
