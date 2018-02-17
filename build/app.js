// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
require = (function (modules, cache, entry) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof require === "function" && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof require === "function" && require;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  // Override the current require with this new one
  return newRequire;
})({1:[function(require,module,exports) {
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

window.Laxe = function () {
    var o = {
        speed: 1,
        axis: 'y'
    };

    function findOffset(e) {
        var x = 0;
        var y = 0;

        var p = e.offsetParent;
        if (p != null && p !== 'body') {
            var _o = findOffset(p);

            x += _o.x;
            y += _o.y;
        }

        x += e.offsetLeft;
        y += e.offsetTop;

        return { x: x, y: y };
    }

    var elms = [];
    var preSetup = function preSetup() {
        elms = elms.map(function (elm) {
            var s = Object.keys(o).reduce(function (acc, k) {
                acc[k] = o[k];

                if (elm.dataset.hasOwnProperty(k)) {
                    acc[k] = elm.dataset[k];

                    if (typeof o[k] == 'number') {
                        acc[k] = parseFloat(acc[k]);
                    }
                }

                return acc;
            }, {});

            s['_p'] = findOffset(elm);

            return { e: elm, s: s };
        });
    };

    var setup = function setup() {
        elms.forEach(function (e) {
            e.e.style.position = 'fixed';
            e.e.style.top = e.s._p.y + 'px';
            e.e.style.left = e.s._p.x + 'px';
        });
    };

    var move = function move(e) {
        var y = e.deltaY;

        elms.forEach(function (elm) {
            var a = elm.s.axis;

            if (['x', 'y'].indexOf(a) > -1) {
                elm.s._p[a] += y;

                elm.e.style[a === 'y' ? 'top' : 'left'] = elm.s._p[a] * elm.s.speed + 'px';
            } else {
                elm.s._p.x += y;
                elm.s._p.y += y;

                elm.e.style.left = elm.s._p.x * elm.s.speed + 'px';
                elm.e.style.top = elm.s._p.y * elm.s.speed + 'px';
            }
        });
    };

    var touch = {};
    var touchStart = function touchStart(e) {
        return touch.deltaY = e.touches[0].screenY;
    };
    var touchEnd = function touchEnd(e) {
        touch.deltaY -= e.changedTouches[0].screenY;
        move(touch);
    };

    return function () {
        function Laxe(thing) {
            _classCallCheck(this, Laxe);

            if (['.', '#'].indexOf(thing[0]) > -1) {
                elms = [].concat(_toConsumableArray(document.querySelectorAll(thing)));
                preSetup();
                setup();

                window.addEventListener('mousewheel', move);
                window.addEventListener('touchstart', touchStart);
                window.addEventListener('touchend', touchEnd);
            } else {
                throw new Error('Please provide either a class or id using the corrsponding specifier');
            }
        }

        _createClass(Laxe, [{
            key: 'destroy',
            value: function destroy() {
                window.addEventListener('mousewheel', move);
                window.addEventListener('touchstart', touchStart);
                window.addEventListener('touchend', touchEnd);
            }
        }]);

        return Laxe;
    }();
}();
},{}],2:[function(require,module,exports) {

var global = (1, eval)('this');
var OldModule = module.bundle.Module;
function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    accept: function (fn) {
      this._acceptCallback = fn || function () {};
    },
    dispose: function (fn) {
      this._disposeCallback = fn;
    }
  };
}

module.bundle.Module = Module;

var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = '' || location.hostname;
  var protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + '38551' + '/');
  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      data.assets.forEach(function (asset) {
        hmrApply(global.require, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.require, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + 'data.error.stack');
    }
  };
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(+k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  if (cached && cached.hot._disposeCallback) {
    cached.hot._disposeCallback();
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallback) {
    cached.hot._acceptCallback();
    return true;
  }

  return getParents(global.require, id).some(function (id) {
    return hmrAccept(global.require, id);
  });
}
},{}]},{},[2,1])
//# sourceMappingURL=/build/app.map