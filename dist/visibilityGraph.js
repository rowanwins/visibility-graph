!function(n,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(n="undefined"!=typeof globalThis?globalThis:n||self).visibilityGraph=t()}(this,(function(){"use strict";function n(n){return n&&n.__esModule&&Object.prototype.hasOwnProperty.call(n,"default")?n.default:n}var t=function(n){!function(n){if(!n)throw new Error("Eventify cannot use falsy object as events subject");for(var t=["on","fire","off"],e=0;e<t.length;++e)if(n.hasOwnProperty(t[e]))throw new Error("Subject cannot be eventified, since it already has property '"+t[e]+"'")}(n);var t=function(n){var t=Object.create(null);return{on:function(e,i,o){if("function"!=typeof i)throw new Error("callback is expected to be a function");var r=t[e];return r||(r=t[e]=[]),r.push({callback:i,ctx:o}),n},off:function(e,i){if(void 0===e)return t=Object.create(null),n;if(t[e])if("function"!=typeof i)delete t[e];else for(var o=t[e],r=0;r<o.length;++r)o[r].callback===i&&o.splice(r,1);return n},fire:function(e){var i,o=t[e];if(!o)return n;arguments.length>1&&(i=Array.prototype.splice.call(arguments,1));for(var r=0;r<o.length;++r){var s=o[r];s.callback.apply(s.ctx,i)}return n}}}(n);return n.on=t.on,n.off=t.off,n.fire=t.fire,n};var e=function(n){"uniqueLinkId"in(n=n||{})&&(console.warn("ngraph.graph: Starting from version 0.14 `uniqueLinkId` is deprecated.\nUse `multigraph` option instead\n","\n","Note: there is also change in default behavior: From now on each graph\nis considered to be not a multigraph by default (each edge is unique)."),n.multigraph=n.uniqueLinkId);void 0===n.multigraph&&(n.multigraph=!1);if("function"!=typeof Map)throw new Error("ngraph.graph requires `Map` to be defined. Please polyfill it before using ngraph");var t=new Map,e=new Map,u={},d=0,h=n.multigraph?function(n,t,e){var i=a(n,t),o=u.hasOwnProperty(i);if(o||M(n,t)){o||(u[i]=0);var r="@"+ ++u[i];i=a(n+r,t+r)}return new s(n,t,e,i)}:function(n,t,i){var o=a(n,t),r=e.get(o);if(r)return r.data=i,r;return new s(n,t,i,o)},f=[],l=_,c=_,p=_,g=_,y={version:20,addNode:x,addLink:function(n,t,i){p();var o=w(n)||x(n),s=w(t)||x(t),a=h(n,t,i),u=e.has(a.id);e.set(a.id,a),r(o,a),n!==t&&r(s,a);return l(a,u?"update":"add"),g(),a},removeLink:function(n,t){void 0!==t&&(n=M(n,t));return E(n)},removeNode:I,getNode:w,getNodeCount:P,getLinkCount:m,getEdgeCount:m,getLinksCount:m,getNodesCount:P,getLinks:function(n){var t=w(n);return t?t.links:null},forEachNode:N,forEachLinkedNode:function(n,e,i){var o=w(n);if(o&&o.links&&"function"==typeof e)return i?function(n,e,i){var o=n.values(),r=o.next();for(;!r.done;){var s=r.value;if(s.fromId===e&&i(t.get(s.toId),s))return!0;r=o.next()}}(o.links,n,e):function(n,e,i){var o=n.values(),r=o.next();for(;!r.done;){var s=r.value,a=s.fromId===e?s.toId:s.fromId;if(i(t.get(a),s))return!0;r=o.next()}}(o.links,n,e)},forEachLink:function(n){if("function"==typeof n)for(var t=e.values(),i=t.next();!i.done;){if(n(i.value))return!0;i=t.next()}},beginUpdate:p,endUpdate:g,clear:function(){p(),N((function(n){I(n.id)})),g()},hasLink:M,hasNode:w,getLink:M};return i(y),function(){var n=y.on;function t(){return y.beginUpdate=p=b,y.endUpdate=g=O,l=v,c=k,y.on=n,n.apply(y,arguments)}y.on=t}(),y;function v(n,t){f.push({link:n,changeType:t})}function k(n,t){f.push({node:n,changeType:t})}function x(n,e){if(void 0===n)throw new Error("Invalid node identifier");p();var i=w(n);return i?(i.data=e,c(i,"update")):(i=new o(n,e),c(i,"add")),t.set(n,i),g(),i}function w(n){return t.get(n)}function I(n){var e=w(n);if(!e)return!1;p();var i=e.links;return i&&(i.forEach(E),e.links=null),t.delete(n),c(e,"remove"),g(),!0}function P(){return t.size}function m(){return e.size}function E(n){if(!n)return!1;if(!e.get(n.id))return!1;p(),e.delete(n.id);var t=w(n.fromId),i=w(n.toId);return t&&t.links.delete(n),i&&i.links.delete(n),l(n,"remove"),g(),!0}function M(n,t){if(void 0!==n&&void 0!==t)return e.get(a(n,t))}function _(){}function b(){d+=1}function O(){0===(d-=1)&&f.length>0&&(y.fire("changed",f),f.length=0)}function N(n){if("function"!=typeof n)throw new Error("Function is expected to iterate over graph nodes. You passed "+n);for(var e=t.values(),i=e.next();!i.done;){if(n(i.value))return!0;i=e.next()}}},i=t;function o(n,t){this.id=n,this.links=null,this.data=t}function r(n,t){n.links?n.links.add(t):n.links=new Set([t])}function s(n,t,e,i){this.fromId=n,this.toId=t,this.data=e,this.id=i}function a(n,t){return n.toString()+"👉 "+t.toString()}var u=n(e),d=function(n){"uniqueLinkId"in(n=n||{})&&(console.warn("ngraph.graph: Starting from version 0.14 `uniqueLinkId` is deprecated.\nUse `multigraph` option instead\n","\n","Note: there is also change in default behavior: From now on each graph\nis considered to be not a multigraph by default (each edge is unique)."),n.multigraph=n.uniqueLinkId);void 0===n.multigraph&&(n.multigraph=!1);if("function"!=typeof Map)throw new Error("ngraph.graph requires `Map` to be defined. Please polyfill it before using ngraph");var t=new Map,e=[],i={},o=0,r=n.multigraph?function(n,t,e){var o=g(n,t),r=i.hasOwnProperty(o);if(r||_(n,t)){r||(i[o]=0);var s="@"+ ++i[o];o=g(n+s,t+s)}return new p(n,t,e,o)}:function(n,t,e){var i=g(n,t);return new p(n,t,e,i)},s=[],a=b,u=b,d=b,y=b,v={addNode:w,addLink:function(n,t,i){d();var o=I(n)||w(n),s=I(t)||w(t),u=r(n,t,i);e.push(u),c(o,u),n!==t&&c(s,u);return a(u,"add"),y(),u},removeLink:M,removeNode:P,getNode:I,getNodeCount:m,getLinkCount:E,getLinksCount:E,getNodesCount:m,getLinks:function(n){var t=I(n);return t?t.links:null},forEachNode:L,forEachLinkedNode:function(n,e,i){var o=I(n);if(o&&o.links&&"function"==typeof e)return i?function(n,e,i){for(var o=0;o<n.length;++o){var r=n[o];if(r.fromId===e&&i(t.get(r.toId),r))return!0}}(o.links,n,e):function(n,e,i){for(var o=0;o<n.length;++o){var r=n[o],s=r.fromId===e?r.toId:r.fromId;if(i(t.get(s),r))return!0}}(o.links,n,e)},forEachLink:function(n){var t,i;if("function"==typeof n)for(t=0,i=e.length;t<i;++t)n(e[t])},beginUpdate:d,endUpdate:y,clear:function(){d(),L((function(n){P(n.id)})),y()},hasLink:_,hasNode:I,getLink:_};return h(v),function(){var n=v.on;function t(){return v.beginUpdate=d=O,v.endUpdate=y=N,a=k,u=x,v.on=n,n.apply(v,arguments)}v.on=t}(),v;function k(n,t){s.push({link:n,changeType:t})}function x(n,t){s.push({node:n,changeType:t})}function w(n,e){if(void 0===n)throw new Error("Invalid node identifier");d();var i=I(n);return i?(i.data=e,u(i,"update")):(i=new l(n,e),u(i,"add")),t.set(n,i),y(),i}function I(n){return t.get(n)}function P(n){var e=I(n);if(!e)return!1;d();var i=e.links;if(i){e.links=null;for(var o=0;o<i.length;++o)M(i[o])}return t.delete(n),u(e,"remove"),y(),!0}function m(){return t.size}function E(){return e.length}function M(n){if(!n)return!1;var t=f(n,e);if(t<0)return!1;d(),e.splice(t,1);var i=I(n.fromId),o=I(n.toId);return i&&(t=f(n,i.links))>=0&&i.links.splice(t,1),o&&(t=f(n,o.links))>=0&&o.links.splice(t,1),a(n,"remove"),y(),!0}function _(n,t){var e,i=I(n);if(!i||!i.links)return null;for(e=0;e<i.links.length;++e){var o=i.links[e];if(o.fromId===n&&o.toId===t)return o}return null}function b(){}function O(){o+=1}function N(){0===(o-=1)&&s.length>0&&(v.fire("changed",s),s.length=0)}function L(n){if("function"!=typeof n)throw new Error("Function is expected to iterate over graph nodes. You passed "+n);for(var e=t.values(),i=e.next();!i.done;){if(n(i.value))return!0;i=e.next()}}},h=t;function f(n,t){if(!t)return-1;if(t.indexOf)return t.indexOf(n);var e,i=t.length;for(e=0;e<i;e+=1)if(t[e]===n)return e;return-1}function l(n,t){this.id=n,this.links=null,this.data=t}function c(n,t){n.links?n.links.push(t):n.links=[t]}function p(n,t,e,i){this.fromId=n,this.toId=t,this.data=e,this.id=i}function g(n,t){return n.toString()+"👉 "+t.toString()}var y=function(n,t,e){var i;t=t||k,e=e||k,i="string"==typeof n?JSON.parse(n):n;var o,r=v();if(void 0===i.links||void 0===i.nodes)throw new Error("Cannot load graph without links and nodes");for(o=0;o<i.nodes.length;++o){var s=t(i.nodes[o]);if(!s.hasOwnProperty("id"))throw new Error("Graph node format is invalid: Node id is missing");r.addNode(s.id,s.data)}for(o=0;o<i.links.length;++o){var a=e(i.links[o]);if(!a.hasOwnProperty("fromId")||!a.hasOwnProperty("toId"))throw new Error("Graph link format is invalid. Both fromId and toId are required");r.addLink(a.fromId,a.toId,a.data)}return r},v=d;function k(n){return n}var x=n(y);var w=n((function(n,t,e){var i={nodes:[],links:[]},o=t||function(n){var t={id:n.id};void 0!==n.data&&(t.data=n.data);return t},r=e||function(n){var t={fromId:n.fromId,toId:n.toId};void 0!==n.data&&(t.data=n.data);return t};return n.forEachNode((function(n){i.nodes.push(JSON.stringify(o(n)))})),n.forEachLink((function(n){i.links.push(JSON.stringify(r(n)))})),'{"nodes": ['+i.nodes.join(",")+'], "links": ['+i.links.join(",")+"]}"}));class I{keys=[];findKeyPosition(n){let t=0,e=this.keys.length;for(;t<e;){const i=Math.floor((t+e)/2);n.isLessThanOtherEdgeKey(this.keys[i])?e=i:t=i+1}return t}addKey(n){const t=this.findKeyPosition(n);this.keys.splice(t,0,n)}}const P=3*Math.PI/2,m=Math.PI/2;class E{static#n=0;x=0;y=0;nodeId=0;polygonID=0;prevPoint=null;nextPoint=null;edges=[];constructor(n,t){this.x=n[0],this.y=n[1],this.nodeId=E.#n++,this.polygonID=t}isPointEqual(n){return n&&this.x===n.x&&this.y===n.y}angleToPoint(n){if(this.isPointEqual(n))return 0;const t=n.x-this.x,e=n.y-this.y;return 0===t?e<0?P:m:0===e?t<0?Math.PI:0:t<0?Math.PI+Math.atan(e/t):e<0?2*Math.PI+Math.atan(e/t):Math.atan(e/t)}}const M=11102230246251565e-32,_=134217729,b=(3+8*M)*M;function O(n,t,e,i,o){let r,s,a,u,d=t[0],h=i[0],f=0,l=0;h>d==h>-d?(r=d,d=t[++f]):(r=h,h=i[++l]);let c=0;if(f<n&&l<e)for(h>d==h>-d?(s=d+r,a=r-(s-d),d=t[++f]):(s=h+r,a=r-(s-h),h=i[++l]),r=s,0!==a&&(o[c++]=a);f<n&&l<e;)h>d==h>-d?(s=r+d,u=s-r,a=r-(s-u)+(d-u),d=t[++f]):(s=r+h,u=s-r,a=r-(s-u)+(h-u),h=i[++l]),r=s,0!==a&&(o[c++]=a);for(;f<n;)s=r+d,u=s-r,a=r-(s-u)+(d-u),d=t[++f],r=s,0!==a&&(o[c++]=a);for(;l<e;)s=r+h,u=s-r,a=r-(s-u)+(h-u),h=i[++l],r=s,0!==a&&(o[c++]=a);return 0===r&&0!==c||(o[c++]=r),c}function N(n){return new Float64Array(n)}const L=33306690738754716e-32,q=22204460492503146e-32,S=11093356479670487e-47,T=N(4),C=N(8),D=N(12),G=N(16),J=N(4);function K(n,t,e,i,o,r){const s=(t-r)*(e-o),a=(n-o)*(i-r),u=s-a;if(0===s||0===a||s>0!=a>0)return u;const d=Math.abs(s+a);return Math.abs(u)>=L*d?u:-function(n,t,e,i,o,r,s){let a,u,d,h,f,l,c,p,g,y,v,k,x,w,I,P,m,E;const M=n-o,N=e-o,L=t-r,K=i-r;w=M*K,l=_*M,c=l-(l-M),p=M-c,l=_*K,g=l-(l-K),y=K-g,I=p*y-(w-c*g-p*g-c*y),P=L*N,l=_*L,c=l-(l-L),p=L-c,l=_*N,g=l-(l-N),y=N-g,m=p*y-(P-c*g-p*g-c*y),v=I-m,f=I-v,T[0]=I-(v+f)+(f-m),k=w+v,f=k-w,x=w-(k-f)+(v-f),v=x-P,f=x-v,T[1]=x-(v+f)+(f-P),E=k+v,f=E-k,T[2]=k-(E-f)+(v-f),T[3]=E;let U=function(n,t){let e=t[0];for(let i=1;i<n;i++)e+=t[i];return e}(4,T),j=q*s;if(U>=j||-U>=j)return U;if(f=n-M,a=n-(M+f)+(f-o),f=e-N,d=e-(N+f)+(f-o),f=t-L,u=t-(L+f)+(f-r),f=i-K,h=i-(K+f)+(f-r),0===a&&0===u&&0===d&&0===h)return U;if(j=S*s+b*Math.abs(U),U+=M*h+K*a-(L*d+N*u),U>=j||-U>=j)return U;w=a*K,l=_*a,c=l-(l-a),p=a-c,l=_*K,g=l-(l-K),y=K-g,I=p*y-(w-c*g-p*g-c*y),P=u*N,l=_*u,c=l-(l-u),p=u-c,l=_*N,g=l-(l-N),y=N-g,m=p*y-(P-c*g-p*g-c*y),v=I-m,f=I-v,J[0]=I-(v+f)+(f-m),k=w+v,f=k-w,x=w-(k-f)+(v-f),v=x-P,f=x-v,J[1]=x-(v+f)+(f-P),E=k+v,f=E-k,J[2]=k-(E-f)+(v-f),J[3]=E;const F=O(4,T,4,J,C);w=M*h,l=_*M,c=l-(l-M),p=M-c,l=_*h,g=l-(l-h),y=h-g,I=p*y-(w-c*g-p*g-c*y),P=L*d,l=_*L,c=l-(l-L),p=L-c,l=_*d,g=l-(l-d),y=d-g,m=p*y-(P-c*g-p*g-c*y),v=I-m,f=I-v,J[0]=I-(v+f)+(f-m),k=w+v,f=k-w,x=w-(k-f)+(v-f),v=x-P,f=x-v,J[1]=x-(v+f)+(f-P),E=k+v,f=E-k,J[2]=k-(E-f)+(v-f),J[3]=E;const z=O(F,C,4,J,D);w=a*h,l=_*a,c=l-(l-a),p=a-c,l=_*h,g=l-(l-h),y=h-g,I=p*y-(w-c*g-p*g-c*y),P=u*d,l=_*u,c=l-(l-u),p=u-c,l=_*d,g=l-(l-d),y=d-g,m=p*y-(P-c*g-p*g-c*y),v=I-m,f=I-v,J[0]=I-(v+f)+(f-m),k=w+v,f=k-w,x=w-(k-f)+(v-f),v=x-P,f=x-v,J[1]=x-(v+f)+(f-P),E=k+v,f=E-k,J[2]=k-(E-f)+(v-f),J[3]=E;const A=O(z,D,4,J,G);return G[A-1]}(n,t,e,i,o,r,d)}const U=Math.pow(10,10),j=Math.pow(10,10);function F(n,t,e){const i=e.p1,o=e.p2,r=z(n,t,i),s=z(n,t,o),a=z(i,o,n),u=z(i,o,t);if(r!==s&&a!==u)return!0;if(0===r){if(A(n,i,t))return!0;if(A(n,o,t))return!0;if(A(i,n,o))return!0;if(A(i,t,o))return!0}return!1}function z(n,t,e){const i=K(e.x,e.y,t.x,t.y,n.x,n.y);return i>0?1:i<0?-1:0}function A(n,t,e){return t.x<=Math.max(n.x,e.x)&&t.x>=Math.min(n.x,e.x)&&t.y<=Math.max(n.y,e.y)&&t.y>=Math.min(n.y,e.y)}function B(n,t,e){const i=Math.pow(e.x-t.x,2)+Math.pow(e.y-t.y,2),o=Math.pow(e.x-n.x,2)+Math.pow(e.y-n.y,2),r=Math.pow(t.x-n.x,2)+Math.pow(t.y-n.y,2),s=(i+r-o)/(2*Math.sqrt(i)*Math.sqrt(r));return Math.acos(parseInt(s*U)/j)}function Y(n,t,e){const i=function(n,t,e){if(e.containsPoint(n))return n;if(e.containsPoint(t))return t;if(e.p1.x===e.p2.x){if(n.x===t.x)return null;const i=(n.y-t.y)/(n.x-t.x),o=e.p1.x,r=i*(o-n.x)+n.y;return new E([o,r],-1)}if(n.x===t.x){const t=(e.p1.y-e.p2.y)/(e.p1.x-e.p2.x),i=n.x,o=t*(i-e.p1.x)+e.p1.y;return new E([i,o],-1)}const i=(n.y-t.y)/(n.x-t.x),o=(e.p1.y-e.p2.y)/(e.p1.x-e.p2.x);if(i===o)return null;const r=(o*e.p1.x-i*n.x+n.y-e.p1.y)/(o-i),s=o*(r-e.p1.x)+e.p1.y;return new E([r,s],-1)}(n,t,e);return null!==i?H(n,i):0}function H(n,t){return Math.sqrt(Math.pow(t.x-n.x,2)+Math.pow(t.y-n.y,2))}function Q(n,t){t[0]=Math.min(t[0],n.x),t[1]=Math.min(t[1],n.y),t[2]=Math.max(t[2],n.x),t[3]=Math.max(t[3],n.y)}function R(n,t,e){t.prevPoint=n,t.nextPoint=e}class V{p1;p2;edge;constructor(n,t,e){this.p1=n,this.p2=t,this.edge=e}isLessThanOtherEdgeKey(n){if(this.matchesOtherKey(n))return!1;if(!F(this.p1,this.p2,n.edge))return!0;const t=Y(this.p1,this.p2,this.edge),e=Y(this.p1,this.p2,n.edge);if(t>e)return!1;if(t<e)return!0;if(t===e){let t;t=n.edge.containsPoint(this.edge.p1)?this.edge.p1:this.edge.p2;return B(this.p1,this.p2,this.edge.getOtherPointInEdge(t))<B(this.p1,this.p2,n.edge.getOtherPointInEdge(t))}}matchesOtherKey(n){return this.edge.areEdgesEqual(n.edge)}}class W{static createGraphFromGeoJson(n){this.#t(n)}static addSinglePoint(n,t){this.#e(t,n._points.length,0,n)}static sortPoints(n,t){t.sort(((t,e)=>{const i=n.angleToPoint(t),o=n.angleToPoint(e);if(i<o)return-1;if(i>o)return 1;const r=H(n,t),s=H(n,e);return r<s?-1:r>s?1:0}))}static#t(n){const t=n._points,e=t.length;for(let i=0;i<e;i++){const o=t[i];this.#e(o,e,1,n)}}static#e(n,t,e,i){const o=i._clonedPoints,r=i._edges,s=i._polygons,a=i.graph,u=n.prevPoint,d=n.nextPoint;this.sortPoints(n,o);const h=new I,f=new E([1/0,n.y],-1);for(let e=0;e<t;e++){const t=r[e];if(!t.containsPoint(n)&&F(n,f,t)){if(A(n,t.p1,f)||A(n,t.p2,f))continue;h.addKey(new V(n,f,t))}}h.keys.length>100&&console.log(h.keys.length);const l=[];let c=null,p=null;for(let i=0;i<t;i++){const t=o[i];if(t.isPointEqual(n))continue;if(1===e&&n.angleToPoint(t)>Math.PI)break;if(h.keys.length>0)for(let e=0;e<t.edges.length;e++){const i=t.edges[e];if(-1===z(n,t,i.getOtherPointInEdge(t))){const e=new V(n,t,i),o=h.findKeyPosition(e)-1;-1!==o&&h.keys[o].matchesOtherKey(e)&&h.keys.splice(o,1)}}h.keys.length>100&&console.log(h.keys.length);let r=!1;if(null!==c&&0===z(n,c,t)&&A(n,c,t))if(p){r=!0;for(let n=0;n<h.keys.length;n++){const e=h.keys[n];if(!e.edge.containsPoint(c)&&F(c,t,e.edge)){r=!1;break}}r&&this.#i(c,t,s)&&(r=!1)}else r=!1;else 0===h.keys.length?r=!0:F(n,t,h.keys[0].edge)||(r=!0);const a=t.isPointEqual(u)||t.isPointEqual(d);r&&!a&&(r=!this.#i(n,t,s)),r&&l.push(t);for(let e=0;e<t.edges.length;e++){const i=t.edges[e];if(!i.containsPoint(n)&&1===z(n,t,i.getOtherPointInEdge(t))){const e=new V(n,t,i);h.addKey(e)}}c=t,p=r}const g=n.nodeId;a.addNode(g,{x:n.x,y:n.y});for(let n=0;n<l.length;n++){const t=l[n].nodeId;a.addNode(t,{x:l[n].x,y:l[n].y}),a.addLink(g,t)}}static#i(n,t,e){if(n.polygonID!==t.polygonID)return!1;if(-1===n.polygonID||-1===t.polygonID)return!1;const i=new E([(n.x+t.x)/2,(n.y+t.y)/2],-1);return this.#o(i,e[n.polygonID].edges)}static#o(n,t){const e=new E([1/0,n.y],-1);let i=0,o=!1,r=0;for(let s=0;s<t.length;s++){const a=t[s];if(n.y<a.p1.y&&n.y<a.p2.y)continue;if(n.y>a.p1.y&&n.y>a.p2.y)continue;const u=0===z(n,a.p1,e)&&a.p1.x>n.x,d=0===z(n,a.p2,e)&&a.p2.x>n.x,h=u?a.p1:a.p2;u||d?(r=a.getOtherPointInEdge(h).y>n.y?r++:r--,o?(0===r&&i++,o=!1,r=0):o=!0):F(n,e,a)&&i++}return i%2!=0}}class X{edges=[];bbox=[1/0,1/0,-1/0,-1/0]}class Z{p1;p2;constructor(n,t){this.p1=n,this.p2=t,n.edges.push(this),t.edges.push(this)}getOtherPointInEdge(n){return this.p1.isPointEqual(n)?this.p2:this.p1}areEdgesEqual(n){return!(!this.p1.isPointEqual(n.p1)||!this.p2.isPointEqual(n.p2))||!(!this.p1.isPointEqual(n.p2)||!this.p2.isPointEqual(n.p1))}containsPoint(n){return this.p1.isPointEqual(n)||this.p2.isPointEqual(n)}}return class{graph=null;_geoJSON=null;_points=[];_clonedPoints=[];_edges=[];_polygons=[];_lastOrigin=null;_lastDestination=null;constructor(n,t=void 0){this._geoJSON=n,this.#r(),t?this.graph=x(t):(this.graph=u(),W.createGraphFromGeoJson(this))}getNodeIdByLatLon(n){for(let t=0;t<this._points.length;t++)if(this._points[t].x===n[0]&&this._points[t].y===n[1])return this._points[t].nodeId;return null}saveGraphToJson(){return w(this.graph)}addStartAndEndPointsToGraph(n,t){return null!==this._lastOrigin&&(this.graph.removeNode(this._lastOrigin.nodeId),this.graph.removeNode(this._lastDestination.nodeId)),this._lastOrigin=new E(n.geometry.coordinates,-1),this._lastDestination=new E(t.geometry.coordinates,-1),W.addSinglePoint(this,this._lastOrigin),W.addSinglePoint(this,this._lastDestination),{startNode:this._lastOrigin,endNode:this._lastDestination}}#r(){const n="Feature"===this._geoJSON.type?this._geoJSON.geometry:this._geoJSON;("Polygon"===n.type?[n.coordinates]:n.coordinates).forEach(((n,t)=>{const e=new X,i=e.edges,o=e.bbox;this._polygons.push(e),n.forEach((n=>{let e=new E(n[0],t),r=new E(n[1],t);Q(e,o),Q(r,o),e.nextPoint=r;let s=new E(n[2],t);R(e,r,s),this._points.push(e);let a=new Z(e,r);this._edges.push(a),i.push(a);let u=e;e=r,r=s;for(let u=2;u<n.length-2;u++){this._points.push(e),s=new E(n[u+1],t),Q(s,o),R(e,r,s);const d=new Z(e,r);this._edges.push(d),i.push(d),e=r,r=s,a=d}R(e,r,u);const d=new Z(a.p2,r);this._edges.push(d),i.push(d);const h=new Z(r,u);R(r,u,u.nextPoint),this._edges.push(h),i.push(h),this._points.push(e),this._points.push(s)}))})),this._clonedPoints=this._points.slice(0)}}}));
