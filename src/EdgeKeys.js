export class EdgeKeys {

  constructor () {
    this.keys = []
  }

  findKeyPosition (edgekey, p) {
    let lo = 0
    let hi = this.keys.length
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2)
      if (this.keys[mid].isLessThanOtherEdgeKey(edgekey)) hi = mid
      else lo = mid + 1
    }
    return lo
  }

  // addKey (edgekey, blah) {
  //   const lo = this.findKeyPosition(edgekey, blah)
  //   this.keys.splice(lo, 0, edgekey)
  // }
  addKey (edgekey, p) {
    let lo = 0
    let hi = this.keys.length
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2)
      if (this.keys[mid].isLessThanOtherEdgeKey(edgekey)) hi = mid
      else lo = mid + 1
    }
    this.keys.splice(lo, 0, edgekey)
  }
}
