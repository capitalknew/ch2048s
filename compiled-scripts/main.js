(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Field = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _tile = require("./tile");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Field = function () {
    function Field() {
        var w = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 4;
        var h = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

        _classCallCheck(this, Field);

        this.data = {
            width: w, height: h
        };
        this.fields = [];
        this.tiles = [];
        this.defaultTilemapInfo = {
            tileID: -1,
            tile: null,
            loc: [-1, -1]
        };
        this.init();

        this.ontileremove = [];
        this.ontileadd = [];
        this.ontilemove = [];
        this.ontileabsorption = [];
    }

    _createClass(Field, [{
        key: "checkAny",
        value: function checkAny(value) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.tiles[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var tile = _step.value;

                    if (tile.value >= value) return true;
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            return false;
        }
    }, {
        key: "anyPossible",
        value: function anyPossible() {
            var anypossible = 0;
            for (var i = 0; i < this.data.height; i++) {
                for (var j = 0; j < this.data.width; j++) {
                    var _iteratorNormalCompletion2 = true;
                    var _didIteratorError2 = false;
                    var _iteratorError2 = undefined;

                    try {
                        for (var _iterator2 = this.tiles[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                            var tile = _step2.value;

                            if (this.possible(tile, [j, i])) anypossible++;
                            if (anypossible > 0) return true;
                        }
                    } catch (err) {
                        _didIteratorError2 = true;
                        _iteratorError2 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                _iterator2.return();
                            }
                        } finally {
                            if (_didIteratorError2) {
                                throw _iteratorError2;
                            }
                        }
                    }
                }
            }
            if (anypossible > 0) return true;
            return false;
        }
    }, {
        key: "tilePossibleList",
        value: function tilePossibleList(tile) {
            var list = [];
            if (!tile) return list; //empty
            for (var i = 0; i < this.data.height; i++) {
                for (var j = 0; j < this.data.width; j++) {
                    if (this.possible(tile, [j, i])) list.push(this.get([j, i]));
                }
            }
            return list;
        }
    }, {
        key: "possible",
        value: function possible(tile, lto) {
            if (!tile) return false;

            var tilei = this.get(lto);
            var atile = tilei.tile;

            var possibles = !atile || atile.value == tile.value;
            var opponent = !atile || atile.data.side != tile.data.side;
            var piece = tile.possible(lto);
            possibles = possibles && piece;
            //possibles = possibles && opponent; //Hardcore mode

            return possibles;
        }
    }, {
        key: "notSame",
        value: function notSame() {
            var sames = [];
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = this.tiles[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var tile = _step3.value;

                    if (sames.indexOf(tile.value) < 0) {
                        sames.push(tile.value);
                    } else {
                        return false;
                    }
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }

            return true;
        }
    }, {
        key: "genPiece",
        value: function genPiece(exceptPawn) {
            var pawnr = Math.random();
            if (pawnr < 0.4 && !exceptPawn) {
                return 0;
            }

            var rnd = Math.random();
            if (rnd >= 0.0 && rnd < 0.3) {
                return 1;
            } else if (rnd >= 0.3 && rnd < 0.6) {
                return 2;
            } else if (rnd >= 0.6 && rnd < 0.8) {
                return 3;
            } else if (rnd >= 0.8 && rnd < 0.9) {
                return 4;
            }
            return 5;
        }
    }, {
        key: "generateTile",
        value: function generateTile() {
            var tile = new _tile.Tile();

            //Count not occupied
            var notOccupied = [];
            for (var i = 0; i < this.data.height; i++) {
                for (var j = 0; j < this.data.width; j++) {
                    if (!this.fields[i][j].tile) notOccupied.push(this.fields[i][j]);
                }
            }

            if (notOccupied.length > 0) {
                tile.data.piece = this.genPiece();
                tile.data.value = Math.random() < 0.25 ? 4 : 2;
                tile.data.side = Math.random() < 0.5 ? 1 : 0;

                tile.attach(this, notOccupied[Math.floor(Math.random() * notOccupied.length)].loc); //prefer generate single

            } else {
                return false; //Not possible to generate new tiles
            }
            return true;
        }
    }, {
        key: "init",
        value: function init() {
            this.tiles.splice(0, this.tiles.length);
            //this.fields.splice(0, this.fields.length);
            for (var i = 0; i < this.data.height; i++) {
                if (!this.fields[i]) this.fields[i] = [];
                for (var j = 0; j < this.data.width; j++) {
                    var tile = this.fields[i][j] ? this.fields[i][j].tile : null;
                    if (tile) {
                        //if have
                        var _iteratorNormalCompletion4 = true;
                        var _didIteratorError4 = false;
                        var _iteratorError4 = undefined;

                        try {
                            for (var _iterator4 = this.ontileremove[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                                var f = _step4.value;
                                f(tile);
                            }
                        } catch (err) {
                            _didIteratorError4 = true;
                            _iteratorError4 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion4 && _iterator4.return) {
                                    _iterator4.return();
                                }
                            } finally {
                                if (_didIteratorError4) {
                                    throw _iteratorError4;
                                }
                            }
                        }
                    }
                    var ref = Object.assign({}, this.defaultTilemapInfo); //Link with object
                    ref.tileID = -1;
                    ref.tile = null;
                    ref.loc = [j, i];
                    this.fields[i][j] = ref;
                }
            }
            return this;
        }
    }, {
        key: "getTile",
        value: function getTile(loc) {
            return this.get(loc).tile;
        }
    }, {
        key: "get",
        value: function get(loc) {
            if (loc[0] >= 0 && loc[1] >= 0 && loc[0] < this.data.width && loc[1] < this.data.height) {
                return this.fields[loc[1]][loc[0]]; //return reference
            }
            return Object.assign({}, this.defaultTilemapInfo, {
                loc: [loc[0], loc[1]]
            });
        }
    }, {
        key: "put",
        value: function put(loc, tile) {
            if (loc[0] >= 0 && loc[1] >= 0 && loc[0] < this.data.width && loc[1] < this.data.height) {
                var ref = this.fields[loc[1]][loc[0]];
                ref.tileID = tile.id;
                ref.tile = tile;
                tile.replaceIfNeeds();
            }
            return this;
        }
    }, {
        key: "move",
        value: function move(loc, lto) {
            if (loc[0] == lto[0] && loc[1] == lto[1]) return this; //Same location
            if (loc[0] >= 0 && loc[1] >= 0 && loc[0] < this.data.width && loc[1] < this.data.height) {
                var ref = this.fields[loc[1]][loc[0]];
                if (ref.tile) {
                    var tile = ref.tile;
                    ref.tileID = -1;
                    ref.tile = null;
                    tile.data.prev[0] = tile.data.loc[0];
                    tile.data.prev[1] = tile.data.loc[1];
                    tile.data.loc[0] = lto[0];
                    tile.data.loc[1] = lto[1];

                    var old = this.fields[lto[1]][lto[0]];
                    if (old.tile) {
                        var _iteratorNormalCompletion5 = true;
                        var _didIteratorError5 = false;
                        var _iteratorError5 = undefined;

                        try {
                            for (var _iterator5 = this.ontileabsorption[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                                var f = _step5.value;
                                f(old.tile, tile);
                            }
                        } catch (err) {
                            _didIteratorError5 = true;
                            _iteratorError5 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion5 && _iterator5.return) {
                                    _iterator5.return();
                                }
                            } finally {
                                if (_didIteratorError5) {
                                    throw _iteratorError5;
                                }
                            }
                        }
                    }

                    this.clear(lto, tile).put(lto, tile);
                    var _iteratorNormalCompletion6 = true;
                    var _didIteratorError6 = false;
                    var _iteratorError6 = undefined;

                    try {
                        for (var _iterator6 = this.ontilemove[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                            var _f = _step6.value;
                            _f(tile);
                        }
                    } catch (err) {
                        _didIteratorError6 = true;
                        _iteratorError6 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion6 && _iterator6.return) {
                                _iterator6.return();
                            }
                        } finally {
                            if (_didIteratorError6) {
                                throw _iteratorError6;
                            }
                        }
                    }
                }
            }
            return this;
        }
    }, {
        key: "clear",
        value: function clear(loc) {
            var bytile = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            if (loc[0] >= 0 && loc[1] >= 0 && loc[0] < this.data.width && loc[1] < this.data.height) {
                var ref = this.fields[loc[1]][loc[0]];
                if (ref.tile) {
                    var tile = ref.tile;
                    if (tile) {
                        ref.tileID = -1;
                        ref.tile = null;
                        var idx = this.tiles.indexOf(tile);
                        if (idx >= 0) {
                            tile.setLoc([-1, -1]);
                            this.tiles.splice(idx, 1);
                            var _iteratorNormalCompletion7 = true;
                            var _didIteratorError7 = false;
                            var _iteratorError7 = undefined;

                            try {
                                for (var _iterator7 = this.ontileremove[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                                    var f = _step7.value;
                                    f(tile, bytile);
                                }
                            } catch (err) {
                                _didIteratorError7 = true;
                                _iteratorError7 = err;
                            } finally {
                                try {
                                    if (!_iteratorNormalCompletion7 && _iterator7.return) {
                                        _iterator7.return();
                                    }
                                } finally {
                                    if (_didIteratorError7) {
                                        throw _iteratorError7;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return this;
        }
    }, {
        key: "attach",
        value: function attach(tile) {
            var loc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [0, 0];

            if (tile && this.tiles.indexOf(tile) < 0) {
                this.tiles.push(tile);
                tile.setField(this).setLoc(loc).put();
                var _iteratorNormalCompletion8 = true;
                var _didIteratorError8 = false;
                var _iteratorError8 = undefined;

                try {
                    for (var _iterator8 = this.ontileadd[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                        var f = _step8.value;
                        f(tile);
                    }
                } catch (err) {
                    _didIteratorError8 = true;
                    _iteratorError8 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion8 && _iterator8.return) {
                            _iterator8.return();
                        }
                    } finally {
                        if (_didIteratorError8) {
                            throw _iteratorError8;
                        }
                    }
                }
            }
            return this;
        }
    }]);

    return Field;
}();

exports.Field = Field;

},{"./tile":5}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var iconset = ["icons/WhitePawn.png", "icons/WhiteKnight.png", "icons/WhiteBishop.png", "icons/WhiteRook.png", "icons/WhiteQueen.png", "icons/WhiteKing.png"];

var iconsetBlack = ["icons/BlackPawn.png", "icons/BlackKnight.png", "icons/BlackBishop.png", "icons/BlackRook.png", "icons/BlackQueen.png", "icons/BlackKing.png"];

Snap.plugin(function (Snap, Element, Paper, glob) {
    var elproto = Element.prototype;
    elproto.toFront = function () {
        this.prependTo(this.paper);
    };
    elproto.toBack = function () {
        this.appendTo(this.paper);
    };
});

var GraphicsEngine = function () {
    function GraphicsEngine() {
        var svgname = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "#svg";

        _classCallCheck(this, GraphicsEngine);

        this.manager = null;
        this.field = null;
        this.input = null;

        this.graphicsLayers = [];
        this.graphicsTiles = [];
        this.visualization = [];
        this.snap = Snap(svgname);
        this.scene = null;

        this.scoreboard = document.querySelector("#score");

        this.params = {
            border: 10,
            decorationWidth: 5,
            grid: {
                width: 600,
                height: 600
            },
            tile: {
                //width: 128, 
                //height: 128, 
                styles: [{
                    condition: function condition() {
                        var tile = this;
                        return tile.value >= 2 && tile.value < 4;
                    },
                    fill: "rgb(255, 192, 128)"
                }, {
                    condition: function condition() {
                        var tile = this;
                        return tile.value >= 4 && tile.value < 8;
                    },
                    fill: "rgb(224, 128, 96)"
                }, {
                    condition: function condition() {
                        var tile = this;
                        return tile.value >= 8 && tile.value < 16;
                    },
                    fill: "rgb(224, 96, 64)",
                    font: "rgb(255, 255, 255)"
                }, {
                    condition: function condition() {
                        var tile = this;
                        return tile.value >= 16 && tile.value < 32;
                    },
                    fill: "rgb(224, 64, 64)",
                    font: "rgb(255, 255, 255)"
                }, {
                    condition: function condition() {
                        var tile = this;
                        return tile.value >= 32 && tile.value < 64;
                    },
                    fill: "rgb(224, 64, 0)",
                    font: "rgb(255, 255, 255)"
                }, {
                    condition: function condition() {
                        var tile = this;
                        return tile.value >= 64 && tile.value < 128;
                    },
                    fill: "rgb(224, 0, 0)",
                    font: "rgb(255, 255, 255)"
                }, {
                    condition: function condition() {
                        var tile = this;
                        return tile.value >= 128 && tile.value < 256;
                    },
                    fill: "rgb(224, 128, 0)",
                    font: "rgb(255, 255, 255)"
                }, {
                    condition: function condition() {
                        var tile = this;
                        return tile.value >= 256 && tile.value < 512;
                    },
                    fill: "rgb(224, 192, 0)"
                }, {
                    condition: function condition() {
                        var tile = this;
                        return tile.value >= 512 && tile.value < 1024;
                    },
                    fill: "rgb(224, 224, 0)"
                }, {
                    condition: function condition() {
                        var tile = this;
                        return tile.value >= 1024 && tile.value < 2048;
                    },
                    fill: "rgb(255, 224, 0)"
                }, {
                    condition: function condition() {
                        var tile = this;
                        return tile.value >= 2048;
                    },
                    fill: "rgb(255, 230, 0)"
                }]
            }
        };
    }

    _createClass(GraphicsEngine, [{
        key: "createSemiVisible",
        value: function createSemiVisible(loc) {
            var _this = this;

            var object = {
                loc: loc
            };

            var params = this.params;
            var pos = this.calculateGraphicsPosition(loc);

            var s = this.graphicsLayers[2].object;
            var radius = 5;
            var rect = s.rect(0, 0, params.tile.width, params.tile.height, radius, radius);

            var group = s.group(rect);
            group.transform("translate(" + pos[0] + ", " + pos[1] + ")");

            rect.attr({
                fill: "transparent"
            });

            object.element = group;
            object.rectangle = rect;
            object.area = rect;
            object.remove = function () {
                _this.graphicsTiles.splice(_this.graphicsTiles.indexOf(object), 1);
            };
            return object;
        }
    }, {
        key: "createDecoration",
        value: function createDecoration() {
            var w = this.field.data.width;
            var h = this.field.data.height;
            var b = this.params.border;
            var tw = (this.params.tile.width + b) * w + b;
            var th = (this.params.tile.height + b) * h + b;
            this.params.grid.width = tw;
            this.params.grid.height = th;

            var decorationLayer = this.graphicsLayers[0];
            var rect = decorationLayer.object.rect(0, 0, tw, th, 5, 5);
            rect.attr({
                fill: "rgb(255, 224, 192)",
                stroke: "rgb(128, 64, 32)",
                "stroke-width": this.params.decorationWidth
            });
        }
    }, {
        key: "createComposition",
        value: function createComposition() {
            this.graphicsLayers.splice(0, this.graphicsLayers.length);
            var scene = this.snap.group();
            scene.transform("translate(" + this.params.decorationWidth + ", " + this.params.decorationWidth + ")");

            this.scene = scene;
            this.graphicsLayers[0] = { //Decoration
                object: scene.group()
            };
            this.graphicsLayers[1] = {
                object: scene.group()
            };
            this.graphicsLayers[2] = {
                object: scene.group()
            };
            this.graphicsLayers[3] = {
                object: scene.group()
            };
            this.graphicsLayers[4] = {
                object: scene.group()
            };
            this.graphicsLayers[5] = {
                object: scene.group()
            };

            var width = this.manager.field.data.width;
            var height = this.manager.field.data.height;

            this.params.tile.width = (this.params.grid.width - this.params.border * (width + 1) - this.params.decorationWidth * 2) / width;
            this.params.tile.height = (this.params.grid.height - this.params.border * (height + 1) - this.params.decorationWidth * 2) / height;

            for (var y = 0; y < height; y++) {
                this.visualization[y] = [];
                for (var x = 0; x < width; x++) {
                    this.visualization[y][x] = this.createSemiVisible([x, y]);
                }
            }

            this.receiveTiles();
            this.createDecoration();
            this.createGameOver();
            this.createVictory();
            return this;
        }
    }, {
        key: "createGameOver",
        value: function createGameOver() {
            var _this2 = this;

            var screen = this.graphicsLayers[4].object;

            var w = this.field.data.width;
            var h = this.field.data.height;
            var b = this.params.border;
            var tw = (this.params.tile.width + b) * w + b;
            var th = (this.params.tile.height + b) * h + b;

            var bg = screen.rect(0, 0, tw, th, 5, 5);
            bg.attr({
                "fill": "rgba(255, 224, 224, 0.8)"
            });
            var got = screen.text(tw / 2, th / 2 - 30, "Game Over");
            got.attr({
                "font-size": "30",
                "text-anchor": "middle",
                "font-family": "Comic Sans MS"
            });

            var buttonGroup = screen.group();
            buttonGroup.transform("translate(" + (tw / 2 - 50) + ", " + (th / 2 + 20) + ")");
            buttonGroup.click(function () {
                _this2.manager.restart();
                _this2.hideGameover();
            });

            var button = buttonGroup.rect(0, 0, 100, 30);
            button.attr({
                "fill": "rgba(224, 192, 192, 0.8)"
            });

            var buttonText = buttonGroup.text(50, 20, "New game");
            buttonText.attr({
                "font-size": "15",
                "text-anchor": "middle",
                "font-family": "Comic Sans MS"
            });

            this.gameoverscreen = screen;
            screen.attr({ "visibility": "hidden" });

            return this;
        }
    }, {
        key: "createVictory",
        value: function createVictory() {
            var _this3 = this;

            var screen = this.graphicsLayers[5].object;

            var w = this.field.data.width;
            var h = this.field.data.height;
            var b = this.params.border;
            var tw = (this.params.tile.width + b) * w + b;
            var th = (this.params.tile.height + b) * h + b;

            var bg = screen.rect(0, 0, tw, th, 5, 5);
            bg.attr({
                "fill": "rgba(224, 224, 256, 0.8)"
            });
            var got = screen.text(tw / 2, th / 2 - 30, "You won! You got " + this.manager.data.conditionValue + "!");
            got.attr({
                "font-size": "30",
                "text-anchor": "middle",
                "font-family": "Comic Sans MS"
            });

            {
                var buttonGroup = screen.group();
                buttonGroup.transform("translate(" + (tw / 2 + 5) + ", " + (th / 2 + 20) + ")");
                buttonGroup.click(function () {
                    _this3.manager.restart();
                    _this3.hideVictory();
                });

                var button = buttonGroup.rect(0, 0, 100, 30);
                button.attr({
                    "fill": "rgba(128, 128, 255, 0.8)"
                });

                var buttonText = buttonGroup.text(50, 20, "New game");
                buttonText.attr({
                    "font-size": "15",
                    "text-anchor": "middle",
                    "font-family": "Comic Sans MS"
                });
            }

            {
                var _buttonGroup = screen.group();
                _buttonGroup.transform("translate(" + (tw / 2 - 105) + ", " + (th / 2 + 20) + ")");
                _buttonGroup.click(function () {
                    _this3.hideVictory();
                });

                var _button = _buttonGroup.rect(0, 0, 100, 30);
                _button.attr({
                    "fill": "rgba(128, 128, 255, 0.8)"
                });

                var _buttonText = _buttonGroup.text(50, 20, "Continue...");
                _buttonText.attr({
                    "font-size": "15",
                    "text-anchor": "middle",
                    "font-family": "Comic Sans MS"
                });
            }

            this.victoryscreen = screen;
            screen.attr({ "visibility": "hidden" });

            return this;
        }
    }, {
        key: "showVictory",
        value: function showVictory() {
            this.victoryscreen.attr({ "visibility": "visible" });
            this.victoryscreen.attr({
                "opacity": "0"
            });
            this.victoryscreen.animate({
                "opacity": "1"
            }, 1000, mina.easein, function () {});

            return this;
        }
    }, {
        key: "hideVictory",
        value: function hideVictory() {
            var _this4 = this;

            this.victoryscreen.attr({
                "opacity": "1"
            });
            this.victoryscreen.animate({
                "opacity": "0"
            }, 500, mina.easein, function () {
                _this4.victoryscreen.attr({ "visibility": "hidden" });
            });
            return this;
        }
    }, {
        key: "showGameover",
        value: function showGameover() {
            this.gameoverscreen.attr({ "visibility": "visible" });
            this.gameoverscreen.attr({
                "opacity": "0"
            });
            this.gameoverscreen.animate({
                "opacity": "1"
            }, 1000, mina.easein, function () {});
            return this;
        }
    }, {
        key: "hideGameover",
        value: function hideGameover() {
            var _this5 = this;

            this.gameoverscreen.attr({
                "opacity": "1"
            });
            this.gameoverscreen.animate({
                "opacity": "0"
            }, 500, mina.easein, function () {
                _this5.gameoverscreen.attr({ "visibility": "hidden" });
            });
            return this;
        }
    }, {
        key: "selectObject",
        value: function selectObject(tile) {
            for (var i = 0; i < this.graphicsTiles.length; i++) {
                if (this.graphicsTiles[i].tile == tile) return this.graphicsTiles[i];
            }
            return null;
        }
    }, {
        key: "changeStyleObject",
        value: function changeStyleObject(obj) {
            var needup = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            var tile = obj.tile;
            var pos = this.calculateGraphicsPosition(tile.loc);
            var group = obj.element;
            //group.transform(`translate(${pos[0]}, ${pos[1]})`);

            if (needup) group.toFront();
            group.animate({
                "transform": "translate(" + pos[0] + ", " + pos[1] + ")"
            }, 80, mina.easein, function () {});
            obj.pos = pos;

            var style = null;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.params.tile.styles[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var _style = _step.value;

                    if (_style.condition.call(obj.tile)) {
                        style = _style;
                        break;
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            obj.text.attr({ "text": "" + tile.value });
            if (style.font) {
                obj.text.attr("fill", style.font);
            } else {
                obj.text.attr("fill", "black");
            }
            obj.icon.attr({ "xlink:href": obj.tile.data.side == 0 ? iconset[obj.tile.data.piece] : iconsetBlack[obj.tile.data.piece] });

            obj.text.attr({
                "font-size": this.params.tile.width * 0.15, //"16px",
                "text-anchor": "middle",
                "font-family": "Comic Sans MS",
                "color": "black"
            });

            if (!style) return this;
            obj.rectangle.attr({
                fill: style.fill
            });

            return this;
        }
    }, {
        key: "changeStyle",
        value: function changeStyle(tile) {
            var obj = this.selectObject(tile);
            this.changeStyleObject(obj);
            return this;
        }
    }, {
        key: "removeObject",
        value: function removeObject(tile) {
            var object = this.selectObject(tile);
            if (object) object.remove();
            return this;
        }
    }, {
        key: "showMoved",
        value: function showMoved(tile) {
            this.changeStyle(tile, true);
            return this;
        }
    }, {
        key: "calculateGraphicsPosition",
        value: function calculateGraphicsPosition(_ref) {
            var _ref2 = _slicedToArray(_ref, 2),
                x = _ref2[0],
                y = _ref2[1];

            var params = this.params;
            var border = this.params.border;
            return [border + (params.tile.width + border) * x, border + (params.tile.height + border) * y];
        }
    }, {
        key: "selectVisualizer",
        value: function selectVisualizer(loc) {
            if (!loc || !(loc[0] >= 0 && loc[1] >= 0 && loc[0] < this.field.data.width && loc[1] < this.field.data.height)) return null;
            return this.visualization[loc[1]][loc[0]];
        }
    }, {
        key: "createObject",
        value: function createObject(tile) {
            var _this6 = this;

            if (this.selectObject(tile)) return null;

            var object = {
                tile: tile
            };

            var params = this.params;
            var pos = this.calculateGraphicsPosition(tile.loc);

            var s = this.graphicsLayers[1].object;
            var radius = 5;
            var rect = s.rect(0, 0, params.tile.width, params.tile.height, radius, radius);

            var fillsizew = params.tile.width * (0.5 - 0.2);
            var fillsizeh = fillsizew; //params.tile.height * (1.0 - 0.2);

            var icon = s.image("", fillsizew, fillsizeh, params.tile.width - fillsizew * 2, params.tile.height - fillsizeh * 2);

            var text = s.text(params.tile.width / 2, params.tile.height / 2 + params.tile.height * 0.35, "TEST");
            var group = s.group(rect, icon, text);

            group.transform("\n            translate(" + pos[0] + ", " + pos[1] + ") \n            translate(" + params.tile.width / 2 + ", " + params.tile.width / 2 + ") \n            scale(0.01, 0.01) \n            translate(" + -params.tile.width / 2 + ", " + -params.tile.width / 2 + ")\n        ");
            group.attr({ "opacity": "0" });

            group.animate({
                "transform": "\n            translate(" + pos[0] + ", " + pos[1] + ") \n            translate(" + params.tile.width / 2 + ", " + params.tile.width / 2 + ") \n            scale(1.0, 1.0) \n            translate(" + -params.tile.width / 2 + ", " + -params.tile.width / 2 + ")\n            ",
                "opacity": "1"
            }, 80, mina.easein, function () {});

            object.pos = pos;
            object.element = group;
            object.rectangle = rect;
            object.icon = icon;
            object.text = text;
            object.remove = function () {
                _this6.graphicsTiles.splice(_this6.graphicsTiles.indexOf(object), 1);

                group.animate({
                    "transform": "\n                translate(" + object.pos[0] + ", " + object.pos[1] + ") \n                translate(" + params.tile.width / 2 + ", " + params.tile.width / 2 + ") \n                scale(0.01, 0.01) \n                translate(" + -params.tile.width / 2 + ", " + -params.tile.width / 2 + ")\n                ",
                    "opacity": "0"
                }, 80, mina.easein, function () {
                    object.element.remove();
                });
            };

            this.changeStyleObject(object);
            return object;
        }
    }, {
        key: "getInteractionLayer",
        value: function getInteractionLayer() {
            return this.graphicsLayers[3];
        }
    }, {
        key: "clearShowed",
        value: function clearShowed() {
            var width = this.manager.field.data.width;
            var height = this.manager.field.data.height;
            for (var y = 0; y < height; y++) {
                for (var x = 0; x < width; x++) {
                    var vis = this.selectVisualizer([x, y]);
                    vis.area.attr({ fill: "transparent" });
                }
            }
            return this;
        }
    }, {
        key: "showSelected",
        value: function showSelected() {
            if (!this.input.selected) return this;
            var tile = this.input.selected.tile;
            if (!tile) return this;
            var object = this.selectVisualizer(tile.loc);
            if (object) {
                object.area.attr({ "fill": "rgba(255, 0, 0, 0.2)" });
            }
            return this;
        }
    }, {
        key: "showPossible",
        value: function showPossible(tileinfolist) {
            if (!this.input.selected) return this;
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = tileinfolist[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var tileinfo = _step2.value;

                    var tile = tileinfo.tile;
                    var object = this.selectVisualizer(tileinfo.loc);
                    if (object) {
                        object.area.attr({ "fill": "rgba(0, 255, 0, 0.2)" });
                    }
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            return this;
        }
    }, {
        key: "receiveTiles",
        value: function receiveTiles() {
            this.clearTiles();
            var tiles = this.manager.tiles;
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = tiles[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var tile = _step3.value;

                    if (!this.selectObject(tile)) {
                        this.graphicsTiles.push(this.createObject(tile));
                    }
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }

            return this;
        }
    }, {
        key: "clearTiles",
        value: function clearTiles() {
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = this.graphicsTiles[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var tile = _step4.value;

                    if (tile) tile.remove();
                }
            } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion4 && _iterator4.return) {
                        _iterator4.return();
                    }
                } finally {
                    if (_didIteratorError4) {
                        throw _iteratorError4;
                    }
                }
            }

            return this;
        }
    }, {
        key: "pushTile",
        value: function pushTile(tile) {
            if (!this.selectObject(tile)) {
                this.graphicsTiles.push(this.createObject(tile));
            }
            return this;
        }
    }, {
        key: "updateScore",
        value: function updateScore() {
            this.scoreboard.innerHTML = this.manager.data.score;
        }
    }, {
        key: "attachManager",
        value: function attachManager(manager) {
            var _this7 = this;

            this.field = manager.field;
            this.manager = manager;

            this.field.ontileremove.push(function (tile) {
                //when tile removed
                _this7.removeObject(tile);
            });
            this.field.ontilemove.push(function (tile) {
                //when tile moved
                _this7.changeStyle(tile);
            });
            this.field.ontileadd.push(function (tile) {
                //when tile added
                _this7.pushTile(tile);
            });
            this.field.ontileabsorption.push(function (old, tile) {
                _this7.updateScore();
            });

            return this;
        }
    }, {
        key: "attachInput",
        value: function attachInput(input) {
            //May required for send objects and mouse events
            this.input = input;
            input.attachGraphics(this);
            return this;
        }
    }]);

    return GraphicsEngine;
}();

exports.GraphicsEngine = GraphicsEngine;

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Input = function () {
    function Input() {
        var _this = this;

        _classCallCheck(this, Input);

        this.graphic = null;
        this.fields = null;
        this.input = null;
        this.interactionMap = null;
        this.selected = null;

        this.port = {
            onmove: [],
            onstart: [],
            onselect: []
        };

        this.restartbutton = document.querySelector("#restart");

        this.restartbutton.addEventListener("click", function () {
            _this.manager.restart();
        });
    }

    _createClass(Input, [{
        key: "attachManager",
        value: function attachManager(manager) {
            this.field = manager.field;
            this.manager = manager;

            return this;
        }
    }, {
        key: "attachGraphics",
        value: function attachGraphics(graphic) {
            this.graphic = graphic;
            return this;
        }
    }, {
        key: "createInteractionObject",
        value: function createInteractionObject(tileinfo, x, y) {
            var _this2 = this;

            var object = {

                tileinfo: tileinfo,
                loc: [x, y]
            };

            var graphic = this.graphic;
            var params = graphic.params;
            var interactive = graphic.getInteractionLayer();
            var field = this.field;

            var pos = graphic.calculateGraphicsPosition(object.loc);
            var border = this.graphic.params.border;
            var area = interactive.object.rect(pos[0] - border / 2, pos[1] - border / 2, params.tile.width + border, params.tile.height + border).click(function () {
                if (!_this2.selected) {
                    var selected = field.get(object.loc);
                    if (selected) {
                        _this2.selected = selected;
                        var _iteratorNormalCompletion = true;
                        var _didIteratorError = false;
                        var _iteratorError = undefined;

                        try {
                            for (var _iterator = _this2.port.onselect[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                var f = _step.value;
                                f(_this2, _this2.selected);
                            }
                        } catch (err) {
                            _didIteratorError = true;
                            _iteratorError = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion && _iterator.return) {
                                    _iterator.return();
                                }
                            } finally {
                                if (_didIteratorError) {
                                    throw _iteratorError;
                                }
                            }
                        }
                    }
                } else {
                    var _selected = field.get(object.loc);
                    if (_selected && _selected.tile && _selected.tile.loc[0] != -1 && _selected != _this2.selected && !field.possible(_this2.selected.tile, object.loc) && !(object.loc[0] == _this2.selected.loc[0] && object.loc[1] == _this2.selected.loc[1])) {
                        _this2.selected = _selected;
                        var _iteratorNormalCompletion2 = true;
                        var _didIteratorError2 = false;
                        var _iteratorError2 = undefined;

                        try {
                            for (var _iterator2 = _this2.port.onselect[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                var _f = _step2.value;
                                _f(_this2, _this2.selected);
                            }
                        } catch (err) {
                            _didIteratorError2 = true;
                            _iteratorError2 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                    _iterator2.return();
                                }
                            } finally {
                                if (_didIteratorError2) {
                                    throw _iteratorError2;
                                }
                            }
                        }
                    } else {
                        var _selected2 = _this2.selected;
                        _this2.selected = false;
                        var _iteratorNormalCompletion3 = true;
                        var _didIteratorError3 = false;
                        var _iteratorError3 = undefined;

                        try {
                            for (var _iterator3 = _this2.port.onmove[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                                var _f2 = _step3.value;

                                _f2(_this2, _selected2, field.get(object.loc));
                            }
                        } catch (err) {
                            _didIteratorError3 = true;
                            _iteratorError3 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                                    _iterator3.return();
                                }
                            } finally {
                                if (_didIteratorError3) {
                                    throw _iteratorError3;
                                }
                            }
                        }
                    }
                }
            });
            object.rectangle = object.area = area;

            area.attr({
                fill: "transparent"
            });

            return object;
        }
    }, {
        key: "buildInteractionMap",
        value: function buildInteractionMap() {
            var map = {
                tilemap: [],
                gridmap: null
            };

            var graphic = this.graphic;
            var params = graphic.params;
            var interactive = graphic.getInteractionLayer();
            var field = this.field;

            for (var i = 0; i < field.data.height; i++) {
                map.tilemap[i] = [];
                for (var j = 0; j < field.data.width; j++) {
                    map.tilemap[i][j] = this.createInteractionObject(field.get([j, i]), j, i);
                }
            }

            this.interactionMap = map;
            return this;
        }
    }]);

    return Input;
}();

exports.Input = Input;

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Manager = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _field = require("./field");

var _tile = require("./tile");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Manager = function () {
    function Manager() {
        var _this = this;

        _classCallCheck(this, Manager);

        this.graphic = null;
        this.input = null;
        this.field = new _field.Field(4, 4);
        this.data = {
            victory: false,
            score: 0,
            movecounter: 0,
            absorbed: 0,
            conditionValue: 2048
        };

        this.onstartevent = function (controller, tileinfo) {
            _this.gamestart();
        };
        this.onselectevent = function (controller, tileinfo) {
            controller.graphic.clearShowed();
            controller.graphic.showPossible(_this.field.tilePossibleList(tileinfo.tile));
            controller.graphic.showSelected(tileinfo.tile);
        };
        this.onmoveevent = function (controller, selected, tileinfo) {
            if (_this.field.possible(selected.tile, tileinfo.loc)) {
                _this.field.move(selected.loc, tileinfo.loc);
            }

            controller.graphic.clearShowed();
            controller.graphic.showPossible(_this.field.tilePossibleList(selected.tile));
            controller.graphic.showSelected(selected.tile);

            //this.graphic.showGameover();
        };

        this.field.ontileabsorption.push(function (old, tile) {
            if (tile.data.side != old.data.side) {
                tile.value *= 2;
            } else {
                tile.data.side = tile.data.side == 1 ? 0 : 1;
            }
            _this.data.score += tile.value;
            _this.data.absorbed = true;
            _this.graphic.removeObject(old);
            _this.graphic.updateScore();
        });
        this.field.ontileremove.push(function (tile) {
            //when tile removed
            _this.graphic.removeObject(tile);
        });
        this.field.ontilemove.push(function (tile) {
            //when tile moved
            _this.graphic.showMoved(tile);
            if (Math.random() <= 0.75) {
                _this.field.generateTile();
            }
            _this.data.absorbed = false;

            if (!_this.field.anyPossible()) _this.graphic.showGameover();
            if (_this.checkCondition() && !_this.data.victory) {
                _this.resolveVictory();
            }
        });
        this.field.ontileadd.push(function (tile) {
            //when tile added
            _this.graphic.pushTile(tile);
        });
    }

    _createClass(Manager, [{
        key: "resolveVictory",
        value: function resolveVictory() {
            if (!this.data.victory) {
                this.data.victory = true;
                this.graphic.showVictory();
            }
            return this;
        }
    }, {
        key: "checkCondition",
        value: function checkCondition() {
            return this.field.checkAny(this.data.conditionValue);
        }
    }, {
        key: "initUser",
        value: function initUser(_ref) {
            var graphics = _ref.graphics,
                input = _ref.input;

            this.input = input;
            this.input.port.onstart.push(this.onstartevent);
            this.input.port.onselect.push(this.onselectevent);
            this.input.port.onmove.push(this.onmoveevent);
            input.attachManager(this);

            this.graphic = graphics;
            graphics.attachManager(this);

            this.graphic.createComposition();
            this.input.buildInteractionMap();

            return this;
        }
    }, {
        key: "restart",
        value: function restart() {
            this.gamestart();
            return this;
        }
    }, {
        key: "gamestart",
        value: function gamestart() {
            this.data.score = 0;
            this.data.movecounter = 0;
            this.data.absorbed = 0;
            this.field.init();
            this.field.generateTile();
            this.field.generateTile();
            this.data.victory = false;
            this.graphic.updateScore();
            return this;
        }
    }, {
        key: "gamepause",
        value: function gamepause() {
            return this;
        }
    }, {
        key: "gameover",
        value: function gameover(reason) {
            return this;
        }
    }, {
        key: "think",
        value: function think(diff) {
            //???
            return this;
        }
    }, {
        key: "tiles",
        get: function get() {
            return this.field.tiles;
        }
    }]);

    return Manager;
}();

exports.Manager = Manager;

},{"./field":1,"./tile":5}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var kmovemap = [[-2, -1], [2, -1], [-2, 1], [2, 1], [-1, -2], [1, -2], [-1, 2], [1, 2]];

var rdirs = [[0, 1], //down
[0, -1], //up
[1, 0], //left
[-1, 0] //right
];

var bdirs = [[1, 1], [1, -1], [-1, 1], [-1, -1]];

var padirs = [[1, -1], [-1, -1]];

var pmdirs = [[0, -1]];

var padirsNeg = [[1, 1], [-1, 1]];

var pmdirsNeg = [[0, 1]];

var qdirs = rdirs.concat(bdirs); //may not need

var tcounter = 0;

var Tile = function () {
    function Tile() {
        _classCallCheck(this, Tile);

        this.field = null;
        this.data = {
            value: 2,
            piece: 0,
            loc: [-1, -1], //x, y
            prev: [-1, -1],
            side: 0 //White = 0, Black = 1
        };
        this.id = tcounter++;
    }

    _createClass(Tile, [{
        key: "attach",
        value: function attach(field, x, y) {
            field.attach(this, x, y);
            return this;
        }
    }, {
        key: "get",
        value: function get() {
            var relative = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [0, 0];

            if (this.field) return this.field.get([this.data.loc[0] + relative[0], this.data.loc[1] + relative[1]]);
            return null;
        }
    }, {
        key: "move",
        value: function move(lto) {
            if (this.field) this.field.move(this.data.loc, lto);
            return this;
        }
    }, {
        key: "put",
        value: function put() {
            if (this.field) this.field.put(this.data.loc, this);
            return this;
        }
    }, {
        key: "cacheLoc",
        value: function cacheLoc() {
            this.data.prev[0] = this.data.loc[0];
            this.data.prev[1] = this.data.loc[1];
            return this;
        }
    }, {
        key: "setField",
        value: function setField(field) {
            this.field = field;
            return this;
        }
    }, {
        key: "setLoc",
        value: function setLoc(_ref) {
            var _ref2 = _slicedToArray(_ref, 2),
                x = _ref2[0],
                y = _ref2[1];

            this.data.loc[0] = x;
            this.data.loc[1] = y;
            return this;
        }
    }, {
        key: "replaceIfNeeds",
        value: function replaceIfNeeds() {
            if (this.data.piece == 0) {
                if (this.data.loc[1] >= this.field.data.height - 1 && this.data.side == 1) {
                    this.data.piece = this.field.genPiece(true);
                }
                if (this.data.loc[1] <= 0 && this.data.side == 0) {
                    this.data.piece = this.field.genPiece(true);
                }
            }
            return this;
        }
    }, {
        key: "possible",
        value: function possible(loc) {
            if (this.data.piece == 0) {
                //PAWN
                var list = this.getPawnAttackTiles();
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = list[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var m = _step.value;

                        if (m.loc[0] == loc[0] && m.loc[1] == loc[1]) return true;
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }

                list = this.getPawnMoveTiles();
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = list[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var _m = _step2.value;

                        if (_m.loc[0] == loc[0] && _m.loc[1] == loc[1]) return true;
                    }
                } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                        }
                    } finally {
                        if (_didIteratorError2) {
                            throw _iteratorError2;
                        }
                    }
                }
            } else if (this.data.piece == 1) {
                //Knight
                var _list = this.getKnightPossibleTiles();
                var _iteratorNormalCompletion3 = true;
                var _didIteratorError3 = false;
                var _iteratorError3 = undefined;

                try {
                    for (var _iterator3 = _list[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                        var _m2 = _step3.value;

                        if (_m2.loc[0] == loc[0] && _m2.loc[1] == loc[1]) return true;
                    }
                } catch (err) {
                    _didIteratorError3 = true;
                    _iteratorError3 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion3 && _iterator3.return) {
                            _iterator3.return();
                        }
                    } finally {
                        if (_didIteratorError3) {
                            throw _iteratorError3;
                        }
                    }
                }
            } else if (this.data.piece == 2) {
                //Bishop
                var _iteratorNormalCompletion4 = true;
                var _didIteratorError4 = false;
                var _iteratorError4 = undefined;

                try {
                    for (var _iterator4 = bdirs[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                        var d = _step4.value;

                        if (Math.sign(loc[0] - this.loc[0]) != d[0] || Math.sign(loc[1] - this.loc[1]) != d[1]) continue;

                        var _list2 = this.getDirectionTiles(d);
                        var _iteratorNormalCompletion5 = true;
                        var _didIteratorError5 = false;
                        var _iteratorError5 = undefined;

                        try {
                            for (var _iterator5 = _list2.reverse()[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                                var _m3 = _step5.value;

                                if (_m3.loc[0] == loc[0] && _m3.loc[1] == loc[1]) return true;
                            }
                        } catch (err) {
                            _didIteratorError5 = true;
                            _iteratorError5 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion5 && _iterator5.return) {
                                    _iterator5.return();
                                }
                            } finally {
                                if (_didIteratorError5) {
                                    throw _iteratorError5;
                                }
                            }
                        }
                    }
                } catch (err) {
                    _didIteratorError4 = true;
                    _iteratorError4 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion4 && _iterator4.return) {
                            _iterator4.return();
                        }
                    } finally {
                        if (_didIteratorError4) {
                            throw _iteratorError4;
                        }
                    }
                }
            } else if (this.data.piece == 3) {
                //Rook
                var _iteratorNormalCompletion6 = true;
                var _didIteratorError6 = false;
                var _iteratorError6 = undefined;

                try {
                    for (var _iterator6 = rdirs[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                        var _d = _step6.value;

                        if (Math.sign(loc[0] - this.loc[0]) != _d[0] || Math.sign(loc[1] - this.loc[1]) != _d[1]) continue; //Not possible direction

                        var _list3 = this.getDirectionTiles(_d);
                        var _iteratorNormalCompletion7 = true;
                        var _didIteratorError7 = false;
                        var _iteratorError7 = undefined;

                        try {
                            for (var _iterator7 = _list3.reverse()[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                                var _m4 = _step7.value;

                                if (_m4.loc[0] == loc[0] && _m4.loc[1] == loc[1]) return true;
                            }
                        } catch (err) {
                            _didIteratorError7 = true;
                            _iteratorError7 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion7 && _iterator7.return) {
                                    _iterator7.return();
                                }
                            } finally {
                                if (_didIteratorError7) {
                                    throw _iteratorError7;
                                }
                            }
                        }
                    }
                } catch (err) {
                    _didIteratorError6 = true;
                    _iteratorError6 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion6 && _iterator6.return) {
                            _iterator6.return();
                        }
                    } finally {
                        if (_didIteratorError6) {
                            throw _iteratorError6;
                        }
                    }
                }
            } else if (this.data.piece == 4) {
                //Queen
                var _iteratorNormalCompletion8 = true;
                var _didIteratorError8 = false;
                var _iteratorError8 = undefined;

                try {
                    for (var _iterator8 = qdirs[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                        var _d2 = _step8.value;

                        if (Math.sign(loc[0] - this.loc[0]) != _d2[0] || Math.sign(loc[1] - this.loc[1]) != _d2[1]) continue; //Not possible direction

                        var _list4 = this.getDirectionTiles(_d2);
                        var _iteratorNormalCompletion9 = true;
                        var _didIteratorError9 = false;
                        var _iteratorError9 = undefined;

                        try {
                            for (var _iterator9 = _list4.reverse()[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                                var _m5 = _step9.value;

                                if (_m5.loc[0] == loc[0] && _m5.loc[1] == loc[1]) return true;
                            }
                        } catch (err) {
                            _didIteratorError9 = true;
                            _iteratorError9 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion9 && _iterator9.return) {
                                    _iterator9.return();
                                }
                            } finally {
                                if (_didIteratorError9) {
                                    throw _iteratorError9;
                                }
                            }
                        }
                    }
                } catch (err) {
                    _didIteratorError8 = true;
                    _iteratorError8 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion8 && _iterator8.return) {
                            _iterator8.return();
                        }
                    } finally {
                        if (_didIteratorError8) {
                            throw _iteratorError8;
                        }
                    }
                }
            } else if (this.data.piece == 5) {
                //King
                var _iteratorNormalCompletion10 = true;
                var _didIteratorError10 = false;
                var _iteratorError10 = undefined;

                try {
                    for (var _iterator10 = qdirs[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
                        var _d3 = _step10.value;

                        if (Math.sign(loc[0] - this.loc[0]) != _d3[0] || Math.sign(loc[1] - this.loc[1]) != _d3[1]) continue; //Not possible direction

                        var _list5 = this.getNeightborTiles(_d3);
                        var _iteratorNormalCompletion11 = true;
                        var _didIteratorError11 = false;
                        var _iteratorError11 = undefined;

                        try {
                            for (var _iterator11 = _list5[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
                                var _m6 = _step11.value;

                                if (_m6.loc[0] == loc[0] && _m6.loc[1] == loc[1]) return true;
                            }
                        } catch (err) {
                            _didIteratorError11 = true;
                            _iteratorError11 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion11 && _iterator11.return) {
                                    _iterator11.return();
                                }
                            } finally {
                                if (_didIteratorError11) {
                                    throw _iteratorError11;
                                }
                            }
                        }
                    }
                } catch (err) {
                    _didIteratorError10 = true;
                    _iteratorError10 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion10 && _iterator10.return) {
                            _iterator10.return();
                        }
                    } finally {
                        if (_didIteratorError10) {
                            throw _iteratorError10;
                        }
                    }
                }
            }

            return false;
        }
    }, {
        key: "getKnightPossibleTiles",
        value: function getKnightPossibleTiles() {
            var availables = [];
            for (var i = 0; i < kmovemap.length; i++) {
                var loc = kmovemap[i];
                var tif = this.get(loc);
                if (tif) availables.push(tif);
            }
            return availables;
        }
    }, {
        key: "getNeightborTiles",
        value: function getNeightborTiles(dir) {
            var availables = [];
            var maxt = Math.max(this.field.data.width, this.field.data.height);
            var tif = this.get([dir[0], dir[1]]);
            if (tif) availables.push(tif);
            return availables;
        }
    }, {
        key: "getDirectionTiles",
        value: function getDirectionTiles(dir) {
            var availables = [];
            var maxt = Math.max(this.field.data.width, this.field.data.height);
            for (var i = 1; i < maxt; i++) {
                var tif = this.get([dir[0] * i, dir[1] * i]);
                if (tif) availables.push(tif);
                if (tif.tile || !tif) break;
            }
            return availables;
        }
    }, {
        key: "getPawnAttackTiles",
        value: function getPawnAttackTiles() {
            var availables = [];
            var dirs = this.data.side == 0 ? padirs : padirsNeg;
            for (var i = 0; i < dirs.length; i++) {
                var tif = this.get(dirs[i]);
                if (tif && tif.tile) availables.push(tif);
            }
            return availables;
        }
    }, {
        key: "getPawnMoveTiles",
        value: function getPawnMoveTiles() {
            var availables = [];
            var dirs = this.data.side == 0 ? pmdirs : pmdirsNeg;
            for (var i = 0; i < dirs.length; i++) {
                var tif = this.get(dirs[i]);
                if (tif && !tif.tile) availables.push(tif);
            }
            return availables;
        }
    }, {
        key: "value",
        get: function get() {
            return this.data.value;
        },
        set: function set(v) {
            this.data.value = v;
        }
    }, {
        key: "loc",
        get: function get() {
            return this.data.loc;
        },
        set: function set(a) {
            this.data.loc[0] = a[0];
            this.data.loc[1] = a[1];
        }
    }]);

    return Tile;
}();

exports.Tile = Tile;

},{}],6:[function(require,module,exports){
"use strict";

var _graphics = require("./include/graphics");

var _manager = require("./include/manager");

var _input = require("./include/input");

(function () {
    var manager = new _manager.Manager();
    var graphics = new _graphics.GraphicsEngine();
    var input = new _input.Input();

    graphics.attachInput(input);
    manager.initUser({ graphics: graphics, input: input });
    manager.gamestart(); //debug
})();

},{"./include/graphics":2,"./include/input":3,"./include/manager":4}]},{},[6])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJDOlxcVXNlcnNcXGFjdGVyaGRcXERvY3VtZW50c1xcR2l0SHViXFxjaDIwNDhzXFxzY3JpcHRzXFxpbmNsdWRlXFxmaWVsZC5qcyIsIkM6XFxVc2Vyc1xcYWN0ZXJoZFxcRG9jdW1lbnRzXFxHaXRIdWJcXGNoMjA0OHNcXHNjcmlwdHNcXGluY2x1ZGVcXGdyYXBoaWNzLmpzIiwiQzpcXFVzZXJzXFxhY3RlcmhkXFxEb2N1bWVudHNcXEdpdEh1YlxcY2gyMDQ4c1xcc2NyaXB0c1xcaW5jbHVkZVxcaW5wdXQuanMiLCJDOlxcVXNlcnNcXGFjdGVyaGRcXERvY3VtZW50c1xcR2l0SHViXFxjaDIwNDhzXFxzY3JpcHRzXFxpbmNsdWRlXFxtYW5hZ2VyLmpzIiwiQzpcXFVzZXJzXFxhY3RlcmhkXFxEb2N1bWVudHNcXEdpdEh1YlxcY2gyMDQ4c1xcc2NyaXB0c1xcaW5jbHVkZVxcdGlsZS5qcyIsIkM6XFxVc2Vyc1xcYWN0ZXJoZFxcRG9jdW1lbnRzXFxHaXRIdWJcXGNoMjA0OHNcXHNjcmlwdHNcXG1haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTs7Ozs7Ozs7O0FBRUE7Ozs7SUFFTSxLO0FBQ0YscUJBQXlCO0FBQUEsWUFBYixDQUFhLHVFQUFULENBQVM7QUFBQSxZQUFOLENBQU0sdUVBQUYsQ0FBRTs7QUFBQTs7QUFDckIsYUFBSyxJQUFMLEdBQVk7QUFDUixtQkFBTyxDQURDLEVBQ0UsUUFBUTtBQURWLFNBQVo7QUFHQSxhQUFLLE1BQUwsR0FBYyxFQUFkO0FBQ0EsYUFBSyxLQUFMLEdBQWEsRUFBYjtBQUNBLGFBQUssa0JBQUwsR0FBMEI7QUFDdEIsb0JBQVEsQ0FBQyxDQURhO0FBRXRCLGtCQUFNLElBRmdCO0FBR3RCLGlCQUFLLENBQUMsQ0FBQyxDQUFGLEVBQUss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aUNRO0FBQ0wsbUJBQU8sS0FBSyxJQUFMLENBQVUsR0FBakI7QUFDSCxTOzBCQUVPLEMsRUFBRTtBQUNOLGlCQUFLLElBQUwsQ0FBVSxHQUFWLENBQWMsQ0FBZCxJQUFtQixFQUFFLENBQUYsQ0FBbkI7QUFDQSxpQkFBSyxJQUFMLENBQVUsR0FBVixDQUFjLENBQWQsSUFBbUIsRUFBRSxDQUFGLENBQW5CO0FBQ0g7Ozs7OztRQWlLRyxJLEdBQUEsSTs7O0FDaFJSOztBQUNBOztBQUNBOztBQUNBOztBQUVBLENBQUMsWUFBVTtBQUNQLFFBQUksVUFBVSxzQkFBZDtBQUNBLFFBQUksV0FBVyw4QkFBZjtBQUNBLFFBQUksUUFBUSxrQkFBWjs7QUFFQSxhQUFTLFdBQVQsQ0FBcUIsS0FBckI7QUFDQSxZQUFRLFFBQVIsQ0FBaUIsRUFBQyxrQkFBRCxFQUFXLFlBQVgsRUFBakI7QUFDQSxZQUFRLFNBQVIsR0FQTyxDQU9jO0FBQ3hCLENBUkQiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5pbXBvcnQgeyBUaWxlIH0gZnJvbSBcIi4vdGlsZVwiO1xyXG5cclxuY2xhc3MgRmllbGQge1xyXG4gICAgY29uc3RydWN0b3IodyA9IDQsIGggPSA0KXtcclxuICAgICAgICB0aGlzLmRhdGEgPSB7XHJcbiAgICAgICAgICAgIHdpZHRoOiB3LCBoZWlnaHQ6IGhcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuZmllbGRzID0gW107XHJcbiAgICAgICAgdGhpcy50aWxlcyA9IFtdO1xyXG4gICAgICAgIHRoaXMuZGVmYXVsdFRpbGVtYXBJbmZvID0ge1xyXG4gICAgICAgICAgICB0aWxlSUQ6IC0xLFxyXG4gICAgICAgICAgICB0aWxlOiBudWxsLFxyXG4gICAgICAgICAgICBsb2M6IFstMSwgLTFdXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmluaXQoKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLm9udGlsZXJlbW92ZSA9IFtdO1xyXG4gICAgICAgIHRoaXMub250aWxlYWRkID0gW107XHJcbiAgICAgICAgdGhpcy5vbnRpbGVtb3ZlID0gW107XHJcbiAgICAgICAgdGhpcy5vbnRpbGVhYnNvcnB0aW9uID0gW107XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGNoZWNrQW55KHZhbHVlKXtcclxuICAgICAgICBmb3IobGV0IHRpbGUgb2YgdGhpcy50aWxlcyl7XHJcbiAgICAgICAgICAgIGlmKHRpbGUudmFsdWUgPj0gdmFsdWUpIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGFueVBvc3NpYmxlKCl7XHJcbiAgICAgICAgbGV0IGFueXBvc3NpYmxlID0gMDtcclxuICAgICAgICBmb3IgKGxldCBpPTA7aTx0aGlzLmRhdGEuaGVpZ2h0O2krKykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqPTA7ajx0aGlzLmRhdGEud2lkdGg7aisrKSB7XHJcbiAgICAgICAgICAgICAgICAgZm9yKGxldCB0aWxlIG9mIHRoaXMudGlsZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLnBvc3NpYmxlKHRpbGUsIFtqLCBpXSkpIGFueXBvc3NpYmxlKys7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoYW55cG9zc2libGUgPiAwKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoYW55cG9zc2libGUgPiAwKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgdGlsZVBvc3NpYmxlTGlzdCh0aWxlKXtcclxuICAgICAgICBsZXQgbGlzdCA9IFtdO1xyXG4gICAgICAgIGlmICghdGlsZSkgcmV0dXJuIGxpc3Q7IC8vZW1wdHlcclxuICAgICAgICBmb3IgKGxldCBpPTA7aTx0aGlzLmRhdGEuaGVpZ2h0O2krKykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqPTA7ajx0aGlzLmRhdGEud2lkdGg7aisrKSB7XHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLnBvc3NpYmxlKHRpbGUsIFtqLCBpXSkpIGxpc3QucHVzaCh0aGlzLmdldChbaiwgaV0pKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbGlzdDtcclxuICAgIH1cclxuXHJcblxyXG4gICAgcG9zc2libGUodGlsZSwgbHRvKXtcclxuICAgICAgICBpZiAoIXRpbGUpIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICAgICAgbGV0IHRpbGVpID0gdGhpcy5nZXQobHRvKTtcclxuICAgICAgICBsZXQgYXRpbGUgPSB0aWxlaS50aWxlO1xyXG5cclxuICAgICAgICBsZXQgcG9zc2libGVzID0gIWF0aWxlIHx8IGF0aWxlLnZhbHVlID09IHRpbGUudmFsdWU7XHJcbiAgICAgICAgbGV0IG9wcG9uZW50ID0gIWF0aWxlIHx8IGF0aWxlLmRhdGEuc2lkZSAhPSB0aWxlLmRhdGEuc2lkZTtcclxuICAgICAgICBsZXQgcGllY2UgPSB0aWxlLnBvc3NpYmxlKGx0byk7XHJcbiAgICAgICAgcG9zc2libGVzID0gcG9zc2libGVzICYmIHBpZWNlO1xyXG4gICAgICAgIC8vcG9zc2libGVzID0gcG9zc2libGVzICYmIG9wcG9uZW50OyAvL0hhcmRjb3JlIG1vZGVcclxuXHJcbiAgICAgICAgcmV0dXJuIHBvc3NpYmxlcztcclxuICAgIH1cclxuXHJcbiAgICBub3RTYW1lKCl7XHJcbiAgICAgICAgbGV0IHNhbWVzID0gW107XHJcbiAgICAgICAgZm9yKGxldCB0aWxlIG9mIHRoaXMudGlsZXMpe1xyXG4gICAgICAgICAgICBpZiAoc2FtZXMuaW5kZXhPZih0aWxlLnZhbHVlKSA8IDApIHtcclxuICAgICAgICAgICAgICAgIHNhbWVzLnB1c2godGlsZS52YWx1ZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgZ2VuUGllY2UoZXhjZXB0UGF3bil7XHJcbiAgICAgICAgbGV0IHBhd25yID0gTWF0aC5yYW5kb20oKTtcclxuICAgICAgICBpZiAocGF3bnIgPCAwLjQgJiYgIWV4Y2VwdFBhd24pIHtcclxuICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgcm5kID0gTWF0aC5yYW5kb20oKTtcclxuICAgICAgICBpZihybmQgPj0gMC4wICAgJiYgcm5kIDwgMC4zKXtcclxuICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgfSBlbHNlIFxyXG4gICAgICAgIGlmKHJuZCA+PSAwLjMgJiYgcm5kIDwgMC42KXtcclxuICAgICAgICAgICAgcmV0dXJuIDI7XHJcbiAgICAgICAgfSBlbHNlIFxyXG4gICAgICAgIGlmKHJuZCA+PSAwLjYgJiYgcm5kIDwgMC44KXtcclxuICAgICAgICAgICAgcmV0dXJuIDM7XHJcbiAgICAgICAgfSBlbHNlIFxyXG4gICAgICAgIGlmKHJuZCA+PSAwLjggJiYgcm5kIDwgMC45KXtcclxuICAgICAgICAgICAgcmV0dXJuIDQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiA1O1xyXG4gICAgfVxyXG5cclxuICAgIGdlbmVyYXRlVGlsZSgpe1xyXG4gICAgICAgIGxldCB0aWxlID0gbmV3IFRpbGUoKTtcclxuICAgICAgICBcclxuXHJcbiAgICAgICAgLy9Db3VudCBub3Qgb2NjdXBpZWRcclxuICAgICAgICBsZXQgbm90T2NjdXBpZWQgPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBpPTA7aTx0aGlzLmRhdGEuaGVpZ2h0O2krKykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqPTA7ajx0aGlzLmRhdGEud2lkdGg7aisrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuZmllbGRzW2ldW2pdLnRpbGUpIG5vdE9jY3VwaWVkLnB1c2godGhpcy5maWVsZHNbaV1bal0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBcclxuXHJcbiAgICAgICAgaWYobm90T2NjdXBpZWQubGVuZ3RoID4gMCl7XHJcbiAgICAgICAgICAgIHRpbGUuZGF0YS5waWVjZSA9IHRoaXMuZ2VuUGllY2UoKTtcclxuICAgICAgICAgICAgdGlsZS5kYXRhLnZhbHVlID0gTWF0aC5yYW5kb20oKSA8IDAuMjUgPyA0IDogMjtcclxuICAgICAgICAgICAgdGlsZS5kYXRhLnNpZGUgPSBNYXRoLnJhbmRvbSgpIDwgMC41ID8gMSA6IDA7XHJcblxyXG4gICAgICAgICAgICB0aWxlLmF0dGFjaCh0aGlzLCBub3RPY2N1cGllZFtNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBub3RPY2N1cGllZC5sZW5ndGgpXS5sb2MpOyAvL3ByZWZlciBnZW5lcmF0ZSBzaW5nbGVcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTsgLy9Ob3QgcG9zc2libGUgdG8gZ2VuZXJhdGUgbmV3IHRpbGVzXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBpbml0KCl7XHJcbiAgICAgICAgdGhpcy50aWxlcy5zcGxpY2UoMCwgdGhpcy50aWxlcy5sZW5ndGgpO1xyXG4gICAgICAgIC8vdGhpcy5maWVsZHMuc3BsaWNlKDAsIHRoaXMuZmllbGRzLmxlbmd0aCk7XHJcbiAgICAgICAgZm9yIChsZXQgaT0wO2k8dGhpcy5kYXRhLmhlaWdodDtpKyspIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmZpZWxkc1tpXSkgdGhpcy5maWVsZHNbaV0gPSBbXTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaj0wO2o8dGhpcy5kYXRhLndpZHRoO2orKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IHRpbGUgPSB0aGlzLmZpZWxkc1tpXVtqXSA/IHRoaXMuZmllbGRzW2ldW2pdLnRpbGUgOiBudWxsO1xyXG4gICAgICAgICAgICAgICAgaWYodGlsZSl7IC8vaWYgaGF2ZVxyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGYgb2YgdGhpcy5vbnRpbGVyZW1vdmUpIGYodGlsZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBsZXQgcmVmID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5kZWZhdWx0VGlsZW1hcEluZm8pOyAvL0xpbmsgd2l0aCBvYmplY3RcclxuICAgICAgICAgICAgICAgIHJlZi50aWxlSUQgPSAtMTtcclxuICAgICAgICAgICAgICAgIHJlZi50aWxlID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIHJlZi5sb2MgPSBbaiwgaV07XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZpZWxkc1tpXVtqXSA9IHJlZjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBcclxuICAgIGdldFRpbGUobG9jKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5nZXQobG9jKS50aWxlO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBnZXQobG9jKXtcclxuICAgICAgICBpZiAobG9jWzBdID49IDAgJiYgbG9jWzFdID49IDAgJiYgbG9jWzBdIDwgdGhpcy5kYXRhLndpZHRoICYmIGxvY1sxXSA8IHRoaXMuZGF0YS5oZWlnaHQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmllbGRzW2xvY1sxXV1bbG9jWzBdXTsgLy9yZXR1cm4gcmVmZXJlbmNlXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmRlZmF1bHRUaWxlbWFwSW5mbywge1xyXG4gICAgICAgICAgICBsb2M6IFtsb2NbMF0sIGxvY1sxXV1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHV0KGxvYywgdGlsZSl7XHJcbiAgICAgICAgaWYgKGxvY1swXSA+PSAwICYmIGxvY1sxXSA+PSAwICYmIGxvY1swXSA8IHRoaXMuZGF0YS53aWR0aCAmJiBsb2NbMV0gPCB0aGlzLmRhdGEuaGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIGxldCByZWYgPSB0aGlzLmZpZWxkc1tsb2NbMV1dW2xvY1swXV07XHJcbiAgICAgICAgICAgIHJlZi50aWxlSUQgPSB0aWxlLmlkO1xyXG4gICAgICAgICAgICByZWYudGlsZSA9IHRpbGU7XHJcbiAgICAgICAgICAgIHRpbGUucmVwbGFjZUlmTmVlZHMoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIG1vdmUobG9jLCBsdG8pe1xyXG4gICAgICAgIGlmIChsb2NbMF0gPT0gbHRvWzBdICYmIGxvY1sxXSA9PSBsdG9bMV0pIHJldHVybiB0aGlzOyAvL1NhbWUgbG9jYXRpb25cclxuICAgICAgICBpZiAobG9jWzBdID49IDAgJiYgbG9jWzFdID49IDAgJiYgbG9jWzBdIDwgdGhpcy5kYXRhLndpZHRoICYmIGxvY1sxXSA8IHRoaXMuZGF0YS5oZWlnaHQpIHtcclxuICAgICAgICAgICAgbGV0IHJlZiA9IHRoaXMuZmllbGRzW2xvY1sxXV1bbG9jWzBdXTtcclxuICAgICAgICAgICAgaWYgKHJlZi50aWxlKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgdGlsZSA9IHJlZi50aWxlO1xyXG4gICAgICAgICAgICAgICAgcmVmLnRpbGVJRCA9IC0xO1xyXG4gICAgICAgICAgICAgICAgcmVmLnRpbGUgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgdGlsZS5kYXRhLnByZXZbMF0gPSB0aWxlLmRhdGEubG9jWzBdO1xyXG4gICAgICAgICAgICAgICAgdGlsZS5kYXRhLnByZXZbMV0gPSB0aWxlLmRhdGEubG9jWzFdO1xyXG4gICAgICAgICAgICAgICAgdGlsZS5kYXRhLmxvY1swXSA9IGx0b1swXTtcclxuICAgICAgICAgICAgICAgIHRpbGUuZGF0YS5sb2NbMV0gPSBsdG9bMV07XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IG9sZCA9IHRoaXMuZmllbGRzW2x0b1sxXV1bbHRvWzBdXTtcclxuICAgICAgICAgICAgICAgIGlmIChvbGQudGlsZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGYgb2YgdGhpcy5vbnRpbGVhYnNvcnB0aW9uKSBmKG9sZC50aWxlLCB0aWxlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgdGhpcy5jbGVhcihsdG8sIHRpbGUpLnB1dChsdG8sIHRpbGUpO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgZiBvZiB0aGlzLm9udGlsZW1vdmUpIGYodGlsZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGNsZWFyKGxvYywgYnl0aWxlID0gbnVsbCl7XHJcbiAgICAgICAgaWYgKGxvY1swXSA+PSAwICYmIGxvY1sxXSA+PSAwICYmIGxvY1swXSA8IHRoaXMuZGF0YS53aWR0aCAmJiBsb2NbMV0gPCB0aGlzLmRhdGEuaGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIGxldCByZWYgPSB0aGlzLmZpZWxkc1tsb2NbMV1dW2xvY1swXV07XHJcbiAgICAgICAgICAgIGlmIChyZWYudGlsZSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHRpbGUgPSByZWYudGlsZTtcclxuICAgICAgICAgICAgICAgIGlmICh0aWxlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVmLnRpbGVJRCA9IC0xO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlZi50aWxlID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgaWR4ID0gdGhpcy50aWxlcy5pbmRleE9mKHRpbGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpZHggPj0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aWxlLnNldExvYyhbLTEsIC0xXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGlsZXMuc3BsaWNlKGlkeCwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGYgb2YgdGhpcy5vbnRpbGVyZW1vdmUpIGYodGlsZSwgYnl0aWxlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGF0dGFjaCh0aWxlLCBsb2M9WzAsIDBdKXtcclxuICAgICAgICBpZih0aWxlICYmIHRoaXMudGlsZXMuaW5kZXhPZih0aWxlKSA8IDApIHtcclxuICAgICAgICAgICAgdGhpcy50aWxlcy5wdXNoKHRpbGUpO1xyXG4gICAgICAgICAgICB0aWxlLnNldEZpZWxkKHRoaXMpLnNldExvYyhsb2MpLnB1dCgpO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBmIG9mIHRoaXMub250aWxlYWRkKSBmKHRpbGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHtGaWVsZH07XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxubGV0IGljb25zZXQgPSBbXHJcbiAgICBcImljb25zL1doaXRlUGF3bi5wbmdcIixcclxuICAgIFwiaWNvbnMvV2hpdGVLbmlnaHQucG5nXCIsXHJcbiAgICBcImljb25zL1doaXRlQmlzaG9wLnBuZ1wiLFxyXG4gICAgXCJpY29ucy9XaGl0ZVJvb2sucG5nXCIsXHJcbiAgICBcImljb25zL1doaXRlUXVlZW4ucG5nXCIsXHJcbiAgICBcImljb25zL1doaXRlS2luZy5wbmdcIlxyXG5dO1xyXG5cclxubGV0IGljb25zZXRCbGFjayA9IFtcclxuICAgIFwiaWNvbnMvQmxhY2tQYXduLnBuZ1wiLFxyXG4gICAgXCJpY29ucy9CbGFja0tuaWdodC5wbmdcIixcclxuICAgIFwiaWNvbnMvQmxhY2tCaXNob3AucG5nXCIsXHJcbiAgICBcImljb25zL0JsYWNrUm9vay5wbmdcIixcclxuICAgIFwiaWNvbnMvQmxhY2tRdWVlbi5wbmdcIixcclxuICAgIFwiaWNvbnMvQmxhY2tLaW5nLnBuZ1wiXHJcbl07XHJcblxyXG5TbmFwLnBsdWdpbihmdW5jdGlvbiAoU25hcCwgRWxlbWVudCwgUGFwZXIsIGdsb2IpIHtcclxuICAgIHZhciBlbHByb3RvID0gRWxlbWVudC5wcm90b3R5cGU7XHJcbiAgICBlbHByb3RvLnRvRnJvbnQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5wcmVwZW5kVG8odGhpcy5wYXBlcik7XHJcbiAgICB9O1xyXG4gICAgZWxwcm90by50b0JhY2sgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5hcHBlbmRUbyh0aGlzLnBhcGVyKTtcclxuICAgIH07XHJcbn0pO1xyXG5cclxuY2xhc3MgR3JhcGhpY3NFbmdpbmUge1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3RvcihzdmduYW1lID0gXCIjc3ZnXCIpe1xyXG4gICAgICAgIHRoaXMubWFuYWdlciA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5maWVsZCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5pbnB1dCA9IG51bGw7XHJcblxyXG4gICAgICAgIHRoaXMuZ3JhcGhpY3NMYXllcnMgPSBbXTtcclxuICAgICAgICB0aGlzLmdyYXBoaWNzVGlsZXMgPSBbXTtcclxuICAgICAgICB0aGlzLnZpc3VhbGl6YXRpb24gPSBbXTtcclxuICAgICAgICB0aGlzLnNuYXAgPSBTbmFwKHN2Z25hbWUpO1xyXG4gICAgICAgIHRoaXMuc2NlbmUgPSBudWxsO1xyXG5cclxuICAgICAgICB0aGlzLnNjb3JlYm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3Njb3JlXCIpO1xyXG5cclxuICAgICAgICB0aGlzLnBhcmFtcyA9IHtcclxuICAgICAgICAgICAgYm9yZGVyOiAxMCxcclxuICAgICAgICAgICAgZGVjb3JhdGlvbldpZHRoOiA1LCBcclxuICAgICAgICAgICAgZ3JpZDoge1xyXG4gICAgICAgICAgICAgICAgd2lkdGg6IDYwMCwgXHJcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDYwMFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB0aWxlOiB7XHJcbiAgICAgICAgICAgICAgICAvL3dpZHRoOiAxMjgsIFxyXG4gICAgICAgICAgICAgICAgLy9oZWlnaHQ6IDEyOCwgXHJcbiAgICAgICAgICAgICAgICBzdHlsZXM6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmRpdGlvbjogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0aWxlID0gdGhpczsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGlsZS52YWx1ZSA+PSAyICYmIHRpbGUudmFsdWUgPCA0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbDogXCJyZ2IoMjU1LCAxOTIsIDEyOClcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZGl0aW9uOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRpbGUgPSB0aGlzOyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aWxlLnZhbHVlID49IDQgJiYgdGlsZS52YWx1ZSA8IDg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxsOiBcInJnYigyMjQsIDEyOCwgOTYpXCJcclxuICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmRpdGlvbjogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0aWxlID0gdGhpczsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGlsZS52YWx1ZSA+PSA4ICYmIHRpbGUudmFsdWUgPCAxNjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGw6IFwicmdiKDIyNCwgOTYsIDY0KVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb250OiBcInJnYigyNTUsIDI1NSwgMjU1KVwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25kaXRpb246IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGlsZSA9IHRoaXM7IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRpbGUudmFsdWUgPj0gMTYgJiYgdGlsZS52YWx1ZSA8IDMyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbDogXCJyZ2IoMjI0LCA2NCwgNjQpXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbnQ6IFwicmdiKDI1NSwgMjU1LCAyNTUpXCJcclxuICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmRpdGlvbjogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0aWxlID0gdGhpczsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGlsZS52YWx1ZSA+PSAzMiAmJiB0aWxlLnZhbHVlIDwgNjQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxsOiBcInJnYigyMjQsIDY0LCAwKVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb250OiBcInJnYigyNTUsIDI1NSwgMjU1KVwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25kaXRpb246IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGlsZSA9IHRoaXM7IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRpbGUudmFsdWUgPj0gNjQgJiYgdGlsZS52YWx1ZSA8IDEyODtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGw6IFwicmdiKDIyNCwgMCwgMClcIiwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbnQ6IFwicmdiKDI1NSwgMjU1LCAyNTUpXCJcclxuICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmRpdGlvbjogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0aWxlID0gdGhpczsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGlsZS52YWx1ZSA+PSAxMjggJiYgdGlsZS52YWx1ZSA8IDI1NjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGw6IFwicmdiKDIyNCwgMTI4LCAwKVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb250OiBcInJnYigyNTUsIDI1NSwgMjU1KVwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25kaXRpb246IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGlsZSA9IHRoaXM7IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRpbGUudmFsdWUgPj0gMjU2ICYmIHRpbGUudmFsdWUgPCA1MTI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxsOiBcInJnYigyMjQsIDE5MiwgMClcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZGl0aW9uOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRpbGUgPSB0aGlzOyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aWxlLnZhbHVlID49IDUxMiAmJiB0aWxlLnZhbHVlIDwgMTAyNDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGw6IFwicmdiKDIyNCwgMjI0LCAwKVwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25kaXRpb246IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGlsZSA9IHRoaXM7IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRpbGUudmFsdWUgPj0gMTAyNCAmJiB0aWxlLnZhbHVlIDwgMjA0ODtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGw6IFwicmdiKDI1NSwgMjI0LCAwKVwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25kaXRpb246IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGlsZSA9IHRoaXM7IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRpbGUudmFsdWUgPj0gMjA0ODtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGw6IFwicmdiKDI1NSwgMjMwLCAwKVwiXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlU2VtaVZpc2libGUobG9jKXtcclxuICAgICAgICBsZXQgb2JqZWN0ID0ge1xyXG4gICAgICAgICAgICBsb2M6IGxvY1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IHBhcmFtcyA9IHRoaXMucGFyYW1zO1xyXG4gICAgICAgIGxldCBwb3MgPSB0aGlzLmNhbGN1bGF0ZUdyYXBoaWNzUG9zaXRpb24obG9jKTtcclxuXHJcbiAgICAgICAgbGV0IHMgPSB0aGlzLmdyYXBoaWNzTGF5ZXJzWzJdLm9iamVjdDtcclxuICAgICAgICBsZXQgcmFkaXVzID0gNTtcclxuICAgICAgICBsZXQgcmVjdCA9IHMucmVjdChcclxuICAgICAgICAgICAgMCwgXHJcbiAgICAgICAgICAgIDAsIFxyXG4gICAgICAgICAgICBwYXJhbXMudGlsZS53aWR0aCwgXHJcbiAgICAgICAgICAgIHBhcmFtcy50aWxlLmhlaWdodCxcclxuICAgICAgICAgICAgcmFkaXVzLCByYWRpdXNcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBsZXQgZ3JvdXAgPSBzLmdyb3VwKHJlY3QpO1xyXG4gICAgICAgIGdyb3VwLnRyYW5zZm9ybShgdHJhbnNsYXRlKCR7cG9zWzBdfSwgJHtwb3NbMV19KWApO1xyXG5cclxuICAgICAgICByZWN0LmF0dHIoe1xyXG4gICAgICAgICAgICBmaWxsOiBcInRyYW5zcGFyZW50XCJcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgb2JqZWN0LmVsZW1lbnQgPSBncm91cDtcclxuICAgICAgICBvYmplY3QucmVjdGFuZ2xlID0gcmVjdDtcclxuICAgICAgICBvYmplY3QuYXJlYSA9IHJlY3Q7XHJcbiAgICAgICAgb2JqZWN0LnJlbW92ZSA9ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5ncmFwaGljc1RpbGVzLnNwbGljZSh0aGlzLmdyYXBoaWNzVGlsZXMuaW5kZXhPZihvYmplY3QpLCAxKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBvYmplY3Q7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGNyZWF0ZURlY29yYXRpb24oKXtcclxuICAgICAgICBsZXQgdyA9IHRoaXMuZmllbGQuZGF0YS53aWR0aDtcclxuICAgICAgICBsZXQgaCA9IHRoaXMuZmllbGQuZGF0YS5oZWlnaHQ7XHJcbiAgICAgICAgbGV0IGIgPSB0aGlzLnBhcmFtcy5ib3JkZXI7XHJcbiAgICAgICAgbGV0IHR3ID0gKHRoaXMucGFyYW1zLnRpbGUud2lkdGggKyBiKSAqIHcgKyBiO1xyXG4gICAgICAgIGxldCB0aCA9ICh0aGlzLnBhcmFtcy50aWxlLmhlaWdodCArIGIpICogaCArIGI7XHJcbiAgICAgICAgdGhpcy5wYXJhbXMuZ3JpZC53aWR0aCA9IHR3O1xyXG4gICAgICAgIHRoaXMucGFyYW1zLmdyaWQuaGVpZ2h0ID0gdGg7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IGRlY29yYXRpb25MYXllciA9IHRoaXMuZ3JhcGhpY3NMYXllcnNbMF07XHJcbiAgICAgICAgbGV0IHJlY3QgPSBkZWNvcmF0aW9uTGF5ZXIub2JqZWN0LnJlY3QoMCwgMCwgdHcsIHRoLCA1LCA1KTtcclxuICAgICAgICByZWN0LmF0dHIoe1xyXG4gICAgICAgICAgICBmaWxsOiBcInJnYigyNTUsIDIyNCwgMTkyKVwiLCBcclxuICAgICAgICAgICAgc3Ryb2tlOiBcInJnYigxMjgsIDY0LCAzMilcIixcclxuICAgICAgICAgICAgXCJzdHJva2Utd2lkdGhcIjogdGhpcy5wYXJhbXMuZGVjb3JhdGlvbldpZHRoXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlQ29tcG9zaXRpb24oKXtcclxuICAgICAgICB0aGlzLmdyYXBoaWNzTGF5ZXJzLnNwbGljZSgwLCB0aGlzLmdyYXBoaWNzTGF5ZXJzLmxlbmd0aCk7XHJcbiAgICAgICAgbGV0IHNjZW5lID0gdGhpcy5zbmFwLmdyb3VwKCk7XHJcbiAgICAgICAgc2NlbmUudHJhbnNmb3JtKGB0cmFuc2xhdGUoJHt0aGlzLnBhcmFtcy5kZWNvcmF0aW9uV2lkdGh9LCAke3RoaXMucGFyYW1zLmRlY29yYXRpb25XaWR0aH0pYCk7XHJcblxyXG4gICAgICAgIHRoaXMuc2NlbmUgPSBzY2VuZTtcclxuICAgICAgICB0aGlzLmdyYXBoaWNzTGF5ZXJzWzBdID0geyAvL0RlY29yYXRpb25cclxuICAgICAgICAgICAgb2JqZWN0OiBzY2VuZS5ncm91cCgpXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmdyYXBoaWNzTGF5ZXJzWzFdID0ge1xyXG4gICAgICAgICAgICBvYmplY3Q6IHNjZW5lLmdyb3VwKClcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuZ3JhcGhpY3NMYXllcnNbMl0gPSB7XHJcbiAgICAgICAgICAgIG9iamVjdDogc2NlbmUuZ3JvdXAoKVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5ncmFwaGljc0xheWVyc1szXSA9IHtcclxuICAgICAgICAgICAgb2JqZWN0OiBzY2VuZS5ncm91cCgpXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmdyYXBoaWNzTGF5ZXJzWzRdID0ge1xyXG4gICAgICAgICAgICBvYmplY3Q6IHNjZW5lLmdyb3VwKClcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuZ3JhcGhpY3NMYXllcnNbNV0gPSB7XHJcbiAgICAgICAgICAgIG9iamVjdDogc2NlbmUuZ3JvdXAoKVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGxldCB3aWR0aCA9IHRoaXMubWFuYWdlci5maWVsZC5kYXRhLndpZHRoO1xyXG4gICAgICAgIGxldCBoZWlnaHQgPSB0aGlzLm1hbmFnZXIuZmllbGQuZGF0YS5oZWlnaHQ7XHJcblxyXG4gICAgICAgIHRoaXMucGFyYW1zLnRpbGUud2lkdGggID0gKHRoaXMucGFyYW1zLmdyaWQud2lkdGggIC0gdGhpcy5wYXJhbXMuYm9yZGVyICogKHdpZHRoICsgMSkgIC0gdGhpcy5wYXJhbXMuZGVjb3JhdGlvbldpZHRoKjIpIC8gd2lkdGg7XHJcbiAgICAgICAgdGhpcy5wYXJhbXMudGlsZS5oZWlnaHQgPSAodGhpcy5wYXJhbXMuZ3JpZC5oZWlnaHQgLSB0aGlzLnBhcmFtcy5ib3JkZXIgKiAoaGVpZ2h0ICsgMSkgLSB0aGlzLnBhcmFtcy5kZWNvcmF0aW9uV2lkdGgqMikgLyBoZWlnaHQ7XHJcblxyXG5cclxuICAgICAgICBmb3IobGV0IHk9MDt5PGhlaWdodDt5Kyspe1xyXG4gICAgICAgICAgICB0aGlzLnZpc3VhbGl6YXRpb25beV0gPSBbXTtcclxuICAgICAgICAgICAgZm9yIChsZXQgeD0wO3g8d2lkdGg7eCsrKXtcclxuICAgICAgICAgICAgICAgIHRoaXMudmlzdWFsaXphdGlvblt5XVt4XSA9IHRoaXMuY3JlYXRlU2VtaVZpc2libGUoW3gsIHldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5yZWNlaXZlVGlsZXMoKTtcclxuICAgICAgICB0aGlzLmNyZWF0ZURlY29yYXRpb24oKTtcclxuICAgICAgICB0aGlzLmNyZWF0ZUdhbWVPdmVyKCk7XHJcbiAgICAgICAgdGhpcy5jcmVhdGVWaWN0b3J5KCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuXHJcbiAgICBjcmVhdGVHYW1lT3Zlcigpe1xyXG4gICAgICAgIGxldCBzY3JlZW4gPSB0aGlzLmdyYXBoaWNzTGF5ZXJzWzRdLm9iamVjdDtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgdyA9IHRoaXMuZmllbGQuZGF0YS53aWR0aDtcclxuICAgICAgICBsZXQgaCA9IHRoaXMuZmllbGQuZGF0YS5oZWlnaHQ7XHJcbiAgICAgICAgbGV0IGIgPSB0aGlzLnBhcmFtcy5ib3JkZXI7XHJcbiAgICAgICAgbGV0IHR3ID0gKHRoaXMucGFyYW1zLnRpbGUud2lkdGggKyBiKSAqIHcgKyBiO1xyXG4gICAgICAgIGxldCB0aCA9ICh0aGlzLnBhcmFtcy50aWxlLmhlaWdodCArIGIpICogaCArIGI7XHJcblxyXG4gICAgICAgIGxldCBiZyA9IHNjcmVlbi5yZWN0KDAsIDAsIHR3LCB0aCwgNSwgNSk7XHJcbiAgICAgICAgYmcuYXR0cih7XHJcbiAgICAgICAgICAgIFwiZmlsbFwiOiBcInJnYmEoMjU1LCAyMjQsIDIyNCwgMC44KVwiXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbGV0IGdvdCA9IHNjcmVlbi50ZXh0KHR3IC8gMiwgdGggLyAyIC0gMzAsIFwiR2FtZSBPdmVyXCIpO1xyXG4gICAgICAgIGdvdC5hdHRyKHtcclxuICAgICAgICAgICAgXCJmb250LXNpemVcIjogXCIzMFwiLFxyXG4gICAgICAgICAgICBcInRleHQtYW5jaG9yXCI6IFwibWlkZGxlXCIsIFxyXG4gICAgICAgICAgICBcImZvbnQtZmFtaWx5XCI6IFwiQ29taWMgU2FucyBNU1wiXHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgbGV0IGJ1dHRvbkdyb3VwID0gc2NyZWVuLmdyb3VwKCk7XHJcbiAgICAgICAgYnV0dG9uR3JvdXAudHJhbnNmb3JtKGB0cmFuc2xhdGUoJHt0dyAvIDIgLSA1MH0sICR7dGggLyAyICsgMjB9KWApO1xyXG4gICAgICAgIGJ1dHRvbkdyb3VwLmNsaWNrKCgpPT57XHJcbiAgICAgICAgICAgIHRoaXMubWFuYWdlci5yZXN0YXJ0KCk7XHJcbiAgICAgICAgICAgIHRoaXMuaGlkZUdhbWVvdmVyKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGxldCBidXR0b24gPSBidXR0b25Hcm91cC5yZWN0KDAsIDAsIDEwMCwgMzApO1xyXG4gICAgICAgIGJ1dHRvbi5hdHRyKHtcclxuICAgICAgICAgICAgXCJmaWxsXCI6IFwicmdiYSgyMjQsIDE5MiwgMTkyLCAwLjgpXCJcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgbGV0IGJ1dHRvblRleHQgPSBidXR0b25Hcm91cC50ZXh0KDUwLCAyMCwgXCJOZXcgZ2FtZVwiKTtcclxuICAgICAgICBidXR0b25UZXh0LmF0dHIoe1xyXG4gICAgICAgICAgICBcImZvbnQtc2l6ZVwiOiBcIjE1XCIsXHJcbiAgICAgICAgICAgIFwidGV4dC1hbmNob3JcIjogXCJtaWRkbGVcIiwgXHJcbiAgICAgICAgICAgIFwiZm9udC1mYW1pbHlcIjogXCJDb21pYyBTYW5zIE1TXCJcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5nYW1lb3ZlcnNjcmVlbiA9IHNjcmVlbjtcclxuICAgICAgICBzY3JlZW4uYXR0cih7XCJ2aXNpYmlsaXR5XCI6IFwiaGlkZGVuXCJ9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBjcmVhdGVWaWN0b3J5KCl7XHJcbiAgICAgICAgbGV0IHNjcmVlbiA9IHRoaXMuZ3JhcGhpY3NMYXllcnNbNV0ub2JqZWN0O1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCB3ID0gdGhpcy5maWVsZC5kYXRhLndpZHRoO1xyXG4gICAgICAgIGxldCBoID0gdGhpcy5maWVsZC5kYXRhLmhlaWdodDtcclxuICAgICAgICBsZXQgYiA9IHRoaXMucGFyYW1zLmJvcmRlcjtcclxuICAgICAgICBsZXQgdHcgPSAodGhpcy5wYXJhbXMudGlsZS53aWR0aCArIGIpICogdyArIGI7XHJcbiAgICAgICAgbGV0IHRoID0gKHRoaXMucGFyYW1zLnRpbGUuaGVpZ2h0ICsgYikgKiBoICsgYjtcclxuXHJcbiAgICAgICAgbGV0IGJnID0gc2NyZWVuLnJlY3QoMCwgMCwgdHcsIHRoLCA1LCA1KTtcclxuICAgICAgICBiZy5hdHRyKHtcclxuICAgICAgICAgICAgXCJmaWxsXCI6IFwicmdiYSgyMjQsIDIyNCwgMjU2LCAwLjgpXCJcclxuICAgICAgICB9KTtcclxuICAgICAgICBsZXQgZ290ID0gc2NyZWVuLnRleHQodHcgLyAyLCB0aCAvIDIgLSAzMCwgXCJZb3Ugd29uISBZb3UgZ290IFwiICsgdGhpcy5tYW5hZ2VyLmRhdGEuY29uZGl0aW9uVmFsdWUgKyBcIiFcIik7XHJcbiAgICAgICAgZ290LmF0dHIoe1xyXG4gICAgICAgICAgICBcImZvbnQtc2l6ZVwiOiBcIjMwXCIsXHJcbiAgICAgICAgICAgIFwidGV4dC1hbmNob3JcIjogXCJtaWRkbGVcIiwgXHJcbiAgICAgICAgICAgIFwiZm9udC1mYW1pbHlcIjogXCJDb21pYyBTYW5zIE1TXCJcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCBidXR0b25Hcm91cCA9IHNjcmVlbi5ncm91cCgpO1xyXG4gICAgICAgICAgICBidXR0b25Hcm91cC50cmFuc2Zvcm0oYHRyYW5zbGF0ZSgke3R3IC8gMiArIDV9LCAke3RoIC8gMiArIDIwfSlgKTtcclxuICAgICAgICAgICAgYnV0dG9uR3JvdXAuY2xpY2soKCk9PntcclxuICAgICAgICAgICAgICAgIHRoaXMubWFuYWdlci5yZXN0YXJ0KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhpZGVWaWN0b3J5KCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgbGV0IGJ1dHRvbiA9IGJ1dHRvbkdyb3VwLnJlY3QoMCwgMCwgMTAwLCAzMCk7XHJcbiAgICAgICAgICAgIGJ1dHRvbi5hdHRyKHtcclxuICAgICAgICAgICAgICAgIFwiZmlsbFwiOiBcInJnYmEoMTI4LCAxMjgsIDI1NSwgMC44KVwiXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgbGV0IGJ1dHRvblRleHQgPSBidXR0b25Hcm91cC50ZXh0KDUwLCAyMCwgXCJOZXcgZ2FtZVwiKTtcclxuICAgICAgICAgICAgYnV0dG9uVGV4dC5hdHRyKHtcclxuICAgICAgICAgICAgICAgIFwiZm9udC1zaXplXCI6IFwiMTVcIixcclxuICAgICAgICAgICAgICAgIFwidGV4dC1hbmNob3JcIjogXCJtaWRkbGVcIiwgXHJcbiAgICAgICAgICAgICAgICBcImZvbnQtZmFtaWx5XCI6IFwiQ29taWMgU2FucyBNU1wiXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsZXQgYnV0dG9uR3JvdXAgPSBzY3JlZW4uZ3JvdXAoKTtcclxuICAgICAgICAgICAgYnV0dG9uR3JvdXAudHJhbnNmb3JtKGB0cmFuc2xhdGUoJHt0dyAvIDIgLSAxMDV9LCAke3RoIC8gMiArIDIwfSlgKTtcclxuICAgICAgICAgICAgYnV0dG9uR3JvdXAuY2xpY2soKCk9PntcclxuICAgICAgICAgICAgICAgIHRoaXMuaGlkZVZpY3RvcnkoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgYnV0dG9uID0gYnV0dG9uR3JvdXAucmVjdCgwLCAwLCAxMDAsIDMwKTtcclxuICAgICAgICAgICAgYnV0dG9uLmF0dHIoe1xyXG4gICAgICAgICAgICAgICAgXCJmaWxsXCI6IFwicmdiYSgxMjgsIDEyOCwgMjU1LCAwLjgpXCJcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgYnV0dG9uVGV4dCA9IGJ1dHRvbkdyb3VwLnRleHQoNTAsIDIwLCBcIkNvbnRpbnVlLi4uXCIpO1xyXG4gICAgICAgICAgICBidXR0b25UZXh0LmF0dHIoe1xyXG4gICAgICAgICAgICAgICAgXCJmb250LXNpemVcIjogXCIxNVwiLFxyXG4gICAgICAgICAgICAgICAgXCJ0ZXh0LWFuY2hvclwiOiBcIm1pZGRsZVwiLCBcclxuICAgICAgICAgICAgICAgIFwiZm9udC1mYW1pbHlcIjogXCJDb21pYyBTYW5zIE1TXCJcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnZpY3RvcnlzY3JlZW4gPSBzY3JlZW47XHJcbiAgICAgICAgc2NyZWVuLmF0dHIoe1widmlzaWJpbGl0eVwiOiBcImhpZGRlblwifSk7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHNob3dWaWN0b3J5KCl7XHJcbiAgICAgICAgdGhpcy52aWN0b3J5c2NyZWVuLmF0dHIoe1widmlzaWJpbGl0eVwiOiBcInZpc2libGVcIn0pO1xyXG4gICAgICAgIHRoaXMudmljdG9yeXNjcmVlbi5hdHRyKHtcclxuICAgICAgICAgICAgXCJvcGFjaXR5XCI6IFwiMFwiXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy52aWN0b3J5c2NyZWVuLmFuaW1hdGUoe1xyXG4gICAgICAgICAgICBcIm9wYWNpdHlcIjogXCIxXCJcclxuICAgICAgICB9LCAxMDAwLCBtaW5hLmVhc2VpbiwgKCk9PntcclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIGhpZGVWaWN0b3J5KCl7XHJcbiAgICAgICAgdGhpcy52aWN0b3J5c2NyZWVuLmF0dHIoe1xyXG4gICAgICAgICAgICBcIm9wYWNpdHlcIjogXCIxXCJcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnZpY3RvcnlzY3JlZW4uYW5pbWF0ZSh7XHJcbiAgICAgICAgICAgIFwib3BhY2l0eVwiOiBcIjBcIlxyXG4gICAgICAgIH0sIDUwMCwgbWluYS5lYXNlaW4sICgpPT57XHJcbiAgICAgICAgICAgIHRoaXMudmljdG9yeXNjcmVlbi5hdHRyKHtcInZpc2liaWxpdHlcIjogXCJoaWRkZW5cIn0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHNob3dHYW1lb3Zlcigpe1xyXG4gICAgICAgIHRoaXMuZ2FtZW92ZXJzY3JlZW4uYXR0cih7XCJ2aXNpYmlsaXR5XCI6IFwidmlzaWJsZVwifSk7XHJcbiAgICAgICAgdGhpcy5nYW1lb3ZlcnNjcmVlbi5hdHRyKHtcclxuICAgICAgICAgICAgXCJvcGFjaXR5XCI6IFwiMFwiXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5nYW1lb3ZlcnNjcmVlbi5hbmltYXRlKHtcclxuICAgICAgICAgICAgXCJvcGFjaXR5XCI6IFwiMVwiXHJcbiAgICAgICAgfSwgMTAwMCwgbWluYS5lYXNlaW4sICgpPT57XHJcblxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIGhpZGVHYW1lb3Zlcigpe1xyXG4gICAgICAgIHRoaXMuZ2FtZW92ZXJzY3JlZW4uYXR0cih7XHJcbiAgICAgICAgICAgIFwib3BhY2l0eVwiOiBcIjFcIlxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuZ2FtZW92ZXJzY3JlZW4uYW5pbWF0ZSh7XHJcbiAgICAgICAgICAgIFwib3BhY2l0eVwiOiBcIjBcIlxyXG4gICAgICAgIH0sIDUwMCwgbWluYS5lYXNlaW4sICgpPT57XHJcbiAgICAgICAgICAgIHRoaXMuZ2FtZW92ZXJzY3JlZW4uYXR0cih7XCJ2aXNpYmlsaXR5XCI6IFwiaGlkZGVuXCJ9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBzZWxlY3RPYmplY3QodGlsZSl7XHJcbiAgICAgICAgZm9yKGxldCBpPTA7aTx0aGlzLmdyYXBoaWNzVGlsZXMubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuZ3JhcGhpY3NUaWxlc1tpXS50aWxlID09IHRpbGUpIHJldHVybiB0aGlzLmdyYXBoaWNzVGlsZXNbaV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBjaGFuZ2VTdHlsZU9iamVjdChvYmosIG5lZWR1cCA9IGZhbHNlKXtcclxuICAgICAgICBsZXQgdGlsZSA9IG9iai50aWxlO1xyXG4gICAgICAgIGxldCBwb3MgPSB0aGlzLmNhbGN1bGF0ZUdyYXBoaWNzUG9zaXRpb24odGlsZS5sb2MpO1xyXG4gICAgICAgIGxldCBncm91cCA9IG9iai5lbGVtZW50O1xyXG4gICAgICAgIC8vZ3JvdXAudHJhbnNmb3JtKGB0cmFuc2xhdGUoJHtwb3NbMF19LCAke3Bvc1sxXX0pYCk7XHJcblxyXG4gICAgICAgIGlmIChuZWVkdXApIGdyb3VwLnRvRnJvbnQoKTtcclxuICAgICAgICBncm91cC5hbmltYXRlKHtcclxuICAgICAgICAgICAgXCJ0cmFuc2Zvcm1cIjogYHRyYW5zbGF0ZSgke3Bvc1swXX0sICR7cG9zWzFdfSlgXHJcbiAgICAgICAgfSwgODAsIG1pbmEuZWFzZWluLCAoKT0+e1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB9KTtcclxuICAgICAgICBvYmoucG9zID0gcG9zO1xyXG5cclxuICAgICAgICBsZXQgc3R5bGUgPSBudWxsO1xyXG4gICAgICAgIGZvcihsZXQgX3N0eWxlIG9mIHRoaXMucGFyYW1zLnRpbGUuc3R5bGVzKSB7XHJcbiAgICAgICAgICAgIGlmKF9zdHlsZS5jb25kaXRpb24uY2FsbChvYmoudGlsZSkpIHtcclxuICAgICAgICAgICAgICAgIHN0eWxlID0gX3N0eWxlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG9iai50ZXh0LmF0dHIoe1widGV4dFwiOiBgJHt0aWxlLnZhbHVlfWB9KTtcclxuICAgICAgICBpZiAoc3R5bGUuZm9udCkge1xyXG4gICAgICAgICAgICBvYmoudGV4dC5hdHRyKFwiZmlsbFwiLCBzdHlsZS5mb250KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBvYmoudGV4dC5hdHRyKFwiZmlsbFwiLCBcImJsYWNrXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBvYmouaWNvbi5hdHRyKHtcInhsaW5rOmhyZWZcIjogb2JqLnRpbGUuZGF0YS5zaWRlID09IDAgPyBpY29uc2V0W29iai50aWxlLmRhdGEucGllY2VdIDogaWNvbnNldEJsYWNrW29iai50aWxlLmRhdGEucGllY2VdfSk7XHJcblxyXG4gICAgICAgIG9iai50ZXh0LmF0dHIoe1xyXG4gICAgICAgICAgICBcImZvbnQtc2l6ZVwiOiB0aGlzLnBhcmFtcy50aWxlLndpZHRoICogMC4xNSwgLy9cIjE2cHhcIixcclxuICAgICAgICAgICAgXCJ0ZXh0LWFuY2hvclwiOiBcIm1pZGRsZVwiLCBcclxuICAgICAgICAgICAgXCJmb250LWZhbWlseVwiOiBcIkNvbWljIFNhbnMgTVNcIiwgXHJcbiAgICAgICAgICAgIFwiY29sb3JcIjogXCJibGFja1wiXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmICghc3R5bGUpIHJldHVybiB0aGlzO1xyXG4gICAgICAgIG9iai5yZWN0YW5nbGUuYXR0cih7XHJcbiAgICAgICAgICAgIGZpbGw6IHN0eWxlLmZpbGxcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgY2hhbmdlU3R5bGUodGlsZSl7XHJcbiAgICAgICAgbGV0IG9iaiA9IHRoaXMuc2VsZWN0T2JqZWN0KHRpbGUpO1xyXG4gICAgICAgIHRoaXMuY2hhbmdlU3R5bGVPYmplY3Qob2JqKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICByZW1vdmVPYmplY3QodGlsZSl7XHJcbiAgICAgICAgbGV0IG9iamVjdCA9IHRoaXMuc2VsZWN0T2JqZWN0KHRpbGUpO1xyXG4gICAgICAgIGlmIChvYmplY3QpIG9iamVjdC5yZW1vdmUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBzaG93TW92ZWQodGlsZSl7XHJcbiAgICAgICAgdGhpcy5jaGFuZ2VTdHlsZSh0aWxlLCB0cnVlKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgY2FsY3VsYXRlR3JhcGhpY3NQb3NpdGlvbihbeCwgeV0pe1xyXG4gICAgICAgIGxldCBwYXJhbXMgPSB0aGlzLnBhcmFtcztcclxuICAgICAgICBsZXQgYm9yZGVyID0gdGhpcy5wYXJhbXMuYm9yZGVyO1xyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgIGJvcmRlciArIChwYXJhbXMudGlsZS53aWR0aCAgKyBib3JkZXIpICogeCxcclxuICAgICAgICAgICAgYm9yZGVyICsgKHBhcmFtcy50aWxlLmhlaWdodCArIGJvcmRlcikgKiB5XHJcbiAgICAgICAgXTtcclxuICAgIH1cclxuXHJcbiAgICBzZWxlY3RWaXN1YWxpemVyKGxvYyl7XHJcbiAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAhbG9jIHx8IFxyXG4gICAgICAgICAgICAhKGxvY1swXSA+PSAwICYmIGxvY1sxXSA+PSAwICYmIGxvY1swXSA8IHRoaXMuZmllbGQuZGF0YS53aWR0aCAmJiBsb2NbMV0gPCB0aGlzLmZpZWxkLmRhdGEuaGVpZ2h0KVxyXG4gICAgICAgICkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudmlzdWFsaXphdGlvbltsb2NbMV1dW2xvY1swXV07XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlT2JqZWN0KHRpbGUpe1xyXG4gICAgICAgIGlmICh0aGlzLnNlbGVjdE9iamVjdCh0aWxlKSkgcmV0dXJuIG51bGw7XHJcblxyXG4gICAgICAgIGxldCBvYmplY3QgPSB7XHJcbiAgICAgICAgICAgIHRpbGU6IHRpbGVcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBsZXQgcGFyYW1zID0gdGhpcy5wYXJhbXM7XHJcbiAgICAgICAgbGV0IHBvcyA9IHRoaXMuY2FsY3VsYXRlR3JhcGhpY3NQb3NpdGlvbih0aWxlLmxvYyk7XHJcblxyXG4gICAgICAgIGxldCBzID0gdGhpcy5ncmFwaGljc0xheWVyc1sxXS5vYmplY3Q7XHJcbiAgICAgICAgbGV0IHJhZGl1cyA9IDU7XHJcbiAgICAgICAgbGV0IHJlY3QgPSBzLnJlY3QoXHJcbiAgICAgICAgICAgIDAsIFxyXG4gICAgICAgICAgICAwLCBcclxuICAgICAgICAgICAgcGFyYW1zLnRpbGUud2lkdGgsIFxyXG4gICAgICAgICAgICBwYXJhbXMudGlsZS5oZWlnaHQsXHJcbiAgICAgICAgICAgIHJhZGl1cywgcmFkaXVzXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgbGV0IGZpbGxzaXpldyA9IHBhcmFtcy50aWxlLndpZHRoICAqICgwLjUgLSAwLjIpO1xyXG4gICAgICAgIGxldCBmaWxsc2l6ZWggPSBmaWxsc2l6ZXc7Ly9wYXJhbXMudGlsZS5oZWlnaHQgKiAoMS4wIC0gMC4yKTtcclxuXHJcbiAgICAgICAgbGV0IGljb24gPSBzLmltYWdlKFxyXG4gICAgICAgICAgICBcIlwiLCBcclxuICAgICAgICAgICAgZmlsbHNpemV3LCBcclxuICAgICAgICAgICAgZmlsbHNpemVoLCBcclxuICAgICAgICAgICAgcGFyYW1zLnRpbGUud2lkdGggIC0gZmlsbHNpemV3ICogMiwgXHJcbiAgICAgICAgICAgIHBhcmFtcy50aWxlLmhlaWdodCAtIGZpbGxzaXplaCAqIDJcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBsZXQgdGV4dCA9IHMudGV4dChwYXJhbXMudGlsZS53aWR0aCAvIDIsIHBhcmFtcy50aWxlLmhlaWdodCAvIDIgKyBwYXJhbXMudGlsZS5oZWlnaHQgKiAwLjM1LCBcIlRFU1RcIik7XHJcbiAgICAgICAgbGV0IGdyb3VwID0gcy5ncm91cChyZWN0LCBpY29uLCB0ZXh0KTtcclxuICAgICAgICBcclxuICAgICAgICBncm91cC50cmFuc2Zvcm0oYFxyXG4gICAgICAgICAgICB0cmFuc2xhdGUoJHtwb3NbMF19LCAke3Bvc1sxXX0pIFxyXG4gICAgICAgICAgICB0cmFuc2xhdGUoJHtwYXJhbXMudGlsZS53aWR0aC8yfSwgJHtwYXJhbXMudGlsZS53aWR0aC8yfSkgXHJcbiAgICAgICAgICAgIHNjYWxlKDAuMDEsIDAuMDEpIFxyXG4gICAgICAgICAgICB0cmFuc2xhdGUoJHstcGFyYW1zLnRpbGUud2lkdGgvMn0sICR7LXBhcmFtcy50aWxlLndpZHRoLzJ9KVxyXG4gICAgICAgIGApO1xyXG4gICAgICAgIGdyb3VwLmF0dHIoe1wib3BhY2l0eVwiOiBcIjBcIn0pO1xyXG5cclxuICAgICAgICBncm91cC5hbmltYXRlKHtcclxuICAgICAgICAgICAgXCJ0cmFuc2Zvcm1cIjogXHJcbiAgICAgICAgICAgIGBcclxuICAgICAgICAgICAgdHJhbnNsYXRlKCR7cG9zWzBdfSwgJHtwb3NbMV19KSBcclxuICAgICAgICAgICAgdHJhbnNsYXRlKCR7cGFyYW1zLnRpbGUud2lkdGgvMn0sICR7cGFyYW1zLnRpbGUud2lkdGgvMn0pIFxyXG4gICAgICAgICAgICBzY2FsZSgxLjAsIDEuMCkgXHJcbiAgICAgICAgICAgIHRyYW5zbGF0ZSgkey1wYXJhbXMudGlsZS53aWR0aC8yfSwgJHstcGFyYW1zLnRpbGUud2lkdGgvMn0pXHJcbiAgICAgICAgICAgIGAsXHJcbiAgICAgICAgICAgIFwib3BhY2l0eVwiOiBcIjFcIlxyXG4gICAgICAgIH0sIDgwLCBtaW5hLmVhc2VpbiwgKCk9PntcclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIG9iamVjdC5wb3MgPSBwb3M7XHJcbiAgICAgICAgb2JqZWN0LmVsZW1lbnQgPSBncm91cDtcclxuICAgICAgICBvYmplY3QucmVjdGFuZ2xlID0gcmVjdDtcclxuICAgICAgICBvYmplY3QuaWNvbiA9IGljb247XHJcbiAgICAgICAgb2JqZWN0LnRleHQgPSB0ZXh0O1xyXG4gICAgICAgIG9iamVjdC5yZW1vdmUgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhpY3NUaWxlcy5zcGxpY2UodGhpcy5ncmFwaGljc1RpbGVzLmluZGV4T2Yob2JqZWN0KSwgMSk7XHJcblxyXG4gICAgICAgICAgICBncm91cC5hbmltYXRlKHtcclxuICAgICAgICAgICAgICAgIFwidHJhbnNmb3JtXCI6IFxyXG4gICAgICAgICAgICAgICAgYFxyXG4gICAgICAgICAgICAgICAgdHJhbnNsYXRlKCR7b2JqZWN0LnBvc1swXX0sICR7b2JqZWN0LnBvc1sxXX0pIFxyXG4gICAgICAgICAgICAgICAgdHJhbnNsYXRlKCR7cGFyYW1zLnRpbGUud2lkdGgvMn0sICR7cGFyYW1zLnRpbGUud2lkdGgvMn0pIFxyXG4gICAgICAgICAgICAgICAgc2NhbGUoMC4wMSwgMC4wMSkgXHJcbiAgICAgICAgICAgICAgICB0cmFuc2xhdGUoJHstcGFyYW1zLnRpbGUud2lkdGgvMn0sICR7LXBhcmFtcy50aWxlLndpZHRoLzJ9KVxyXG4gICAgICAgICAgICAgICAgYCxcclxuICAgICAgICAgICAgICAgIFwib3BhY2l0eVwiOiBcIjBcIlxyXG4gICAgICAgICAgICB9LCA4MCwgbWluYS5lYXNlaW4sICgpPT57XHJcbiAgICAgICAgICAgICAgICBvYmplY3QuZWxlbWVudC5yZW1vdmUoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuY2hhbmdlU3R5bGVPYmplY3Qob2JqZWN0KTtcclxuICAgICAgICByZXR1cm4gb2JqZWN0O1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBnZXRJbnRlcmFjdGlvbkxheWVyKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ3JhcGhpY3NMYXllcnNbM107XHJcbiAgICB9XHJcblxyXG4gICAgY2xlYXJTaG93ZWQoKXtcclxuICAgICAgICBsZXQgd2lkdGggPSB0aGlzLm1hbmFnZXIuZmllbGQuZGF0YS53aWR0aDtcclxuICAgICAgICBsZXQgaGVpZ2h0ID0gdGhpcy5tYW5hZ2VyLmZpZWxkLmRhdGEuaGVpZ2h0O1xyXG4gICAgICAgIGZvciAobGV0IHk9MDt5PGhlaWdodDt5Kyspe1xyXG4gICAgICAgICAgICBmb3IgKGxldCB4PTA7eDx3aWR0aDt4Kyspe1xyXG4gICAgICAgICAgICAgICAgbGV0IHZpcyA9IHRoaXMuc2VsZWN0VmlzdWFsaXplcihbeCwgeV0pO1xyXG4gICAgICAgICAgICAgICAgdmlzLmFyZWEuYXR0cih7ZmlsbDogXCJ0cmFuc3BhcmVudFwifSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgc2hvd1NlbGVjdGVkKCl7XHJcbiAgICAgICAgaWYgKCF0aGlzLmlucHV0LnNlbGVjdGVkKSByZXR1cm4gdGhpcztcclxuICAgICAgICBsZXQgdGlsZSA9IHRoaXMuaW5wdXQuc2VsZWN0ZWQudGlsZTtcclxuICAgICAgICBpZiAoIXRpbGUpIHJldHVybiB0aGlzO1xyXG4gICAgICAgIGxldCBvYmplY3QgPSB0aGlzLnNlbGVjdFZpc3VhbGl6ZXIodGlsZS5sb2MpO1xyXG4gICAgICAgIGlmIChvYmplY3Qpe1xyXG4gICAgICAgICAgICBvYmplY3QuYXJlYS5hdHRyKHtcImZpbGxcIjogXCJyZ2JhKDI1NSwgMCwgMCwgMC4yKVwifSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHNob3dQb3NzaWJsZSh0aWxlaW5mb2xpc3Qpe1xyXG4gICAgICAgIGlmICghdGhpcy5pbnB1dC5zZWxlY3RlZCkgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgZm9yKGxldCB0aWxlaW5mbyBvZiB0aWxlaW5mb2xpc3Qpe1xyXG4gICAgICAgICAgICBsZXQgdGlsZSA9IHRpbGVpbmZvLnRpbGU7XHJcbiAgICAgICAgICAgIGxldCBvYmplY3QgPSB0aGlzLnNlbGVjdFZpc3VhbGl6ZXIodGlsZWluZm8ubG9jKTtcclxuICAgICAgICAgICAgaWYob2JqZWN0KXtcclxuICAgICAgICAgICAgICAgIG9iamVjdC5hcmVhLmF0dHIoe1wiZmlsbFwiOiBcInJnYmEoMCwgMjU1LCAwLCAwLjIpXCJ9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICByZWNlaXZlVGlsZXMoKXtcclxuICAgICAgICB0aGlzLmNsZWFyVGlsZXMoKTtcclxuICAgICAgICBsZXQgdGlsZXMgPSB0aGlzLm1hbmFnZXIudGlsZXM7XHJcbiAgICAgICAgZm9yKGxldCB0aWxlIG9mIHRpbGVzKXtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnNlbGVjdE9iamVjdCh0aWxlKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ncmFwaGljc1RpbGVzLnB1c2godGhpcy5jcmVhdGVPYmplY3QodGlsZSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBjbGVhclRpbGVzKCl7XHJcbiAgICAgICAgZm9yIChsZXQgdGlsZSBvZiB0aGlzLmdyYXBoaWNzVGlsZXMpe1xyXG4gICAgICAgICAgICBpZiAodGlsZSkgdGlsZS5yZW1vdmUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHB1c2hUaWxlKHRpbGUpe1xyXG4gICAgICAgIGlmICghdGhpcy5zZWxlY3RPYmplY3QodGlsZSkpIHtcclxuICAgICAgICAgICAgdGhpcy5ncmFwaGljc1RpbGVzLnB1c2godGhpcy5jcmVhdGVPYmplY3QodGlsZSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVTY29yZSgpe1xyXG4gICAgICAgIHRoaXMuc2NvcmVib2FyZC5pbm5lckhUTUwgPSB0aGlzLm1hbmFnZXIuZGF0YS5zY29yZTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgYXR0YWNoTWFuYWdlcihtYW5hZ2VyKXtcclxuICAgICAgICB0aGlzLmZpZWxkID0gbWFuYWdlci5maWVsZDtcclxuICAgICAgICB0aGlzLm1hbmFnZXIgPSBtYW5hZ2VyO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuZmllbGQub250aWxlcmVtb3ZlLnB1c2goKHRpbGUpPT57IC8vd2hlbiB0aWxlIHJlbW92ZWRcclxuICAgICAgICAgICAgdGhpcy5yZW1vdmVPYmplY3QodGlsZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5maWVsZC5vbnRpbGVtb3ZlLnB1c2goKHRpbGUpPT57IC8vd2hlbiB0aWxlIG1vdmVkXHJcbiAgICAgICAgICAgIHRoaXMuY2hhbmdlU3R5bGUodGlsZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5maWVsZC5vbnRpbGVhZGQucHVzaCgodGlsZSk9PnsgLy93aGVuIHRpbGUgYWRkZWRcclxuICAgICAgICAgICAgdGhpcy5wdXNoVGlsZSh0aWxlKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmZpZWxkLm9udGlsZWFic29ycHRpb24ucHVzaCgob2xkLCB0aWxlKT0+e1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVNjb3JlKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBhdHRhY2hJbnB1dChpbnB1dCl7IC8vTWF5IHJlcXVpcmVkIGZvciBzZW5kIG9iamVjdHMgYW5kIG1vdXNlIGV2ZW50c1xyXG4gICAgICAgIHRoaXMuaW5wdXQgPSBpbnB1dDtcclxuICAgICAgICBpbnB1dC5hdHRhY2hHcmFwaGljcyh0aGlzKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIFxyXG59XHJcblxyXG5leHBvcnQge0dyYXBoaWNzRW5naW5lfTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5cclxuY2xhc3MgSW5wdXQge1xyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICB0aGlzLmdyYXBoaWMgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuZmllbGRzID0gbnVsbDtcclxuICAgICAgICB0aGlzLmlucHV0ID0gbnVsbDtcclxuICAgICAgICB0aGlzLmludGVyYWN0aW9uTWFwID0gbnVsbDtcclxuICAgICAgICB0aGlzLnNlbGVjdGVkID0gbnVsbDtcclxuXHJcbiAgICAgICAgdGhpcy5wb3J0ID0ge1xyXG4gICAgICAgICAgICBvbm1vdmU6IFtdLFxyXG4gICAgICAgICAgICBvbnN0YXJ0OiBbXSxcclxuICAgICAgICAgICAgb25zZWxlY3Q6IFtdLFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMucmVzdGFydGJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcmVzdGFydFwiKTtcclxuICAgICAgICBcclxuXHJcbiAgICAgICAgdGhpcy5yZXN0YXJ0YnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKT0+e1xyXG4gICAgICAgICAgICB0aGlzLm1hbmFnZXIucmVzdGFydCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBhdHRhY2hNYW5hZ2VyKG1hbmFnZXIpe1xyXG4gICAgICAgIHRoaXMuZmllbGQgPSBtYW5hZ2VyLmZpZWxkO1xyXG4gICAgICAgIHRoaXMubWFuYWdlciA9IG1hbmFnZXI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGF0dGFjaEdyYXBoaWNzKGdyYXBoaWMpe1xyXG4gICAgICAgIHRoaXMuZ3JhcGhpYyA9IGdyYXBoaWM7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGNyZWF0ZUludGVyYWN0aW9uT2JqZWN0KHRpbGVpbmZvLCB4LCB5KXtcclxuICAgICAgICBsZXQgb2JqZWN0ID0ge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdGlsZWluZm86IHRpbGVpbmZvLFxyXG4gICAgICAgICAgICBsb2M6IFt4LCB5XVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGxldCBncmFwaGljID0gdGhpcy5ncmFwaGljO1xyXG4gICAgICAgIGxldCBwYXJhbXMgPSBncmFwaGljLnBhcmFtcztcclxuICAgICAgICBsZXQgaW50ZXJhY3RpdmUgPSBncmFwaGljLmdldEludGVyYWN0aW9uTGF5ZXIoKTtcclxuICAgICAgICBsZXQgZmllbGQgPSB0aGlzLmZpZWxkO1xyXG5cclxuICAgICAgICBsZXQgcG9zID0gZ3JhcGhpYy5jYWxjdWxhdGVHcmFwaGljc1Bvc2l0aW9uKG9iamVjdC5sb2MpO1xyXG4gICAgICAgIGxldCBib3JkZXIgPSB0aGlzLmdyYXBoaWMucGFyYW1zLmJvcmRlcjtcclxuICAgICAgICBsZXQgYXJlYSA9IGludGVyYWN0aXZlLm9iamVjdC5yZWN0KHBvc1swXSAtIGJvcmRlci8yLCBwb3NbMV0gLSBib3JkZXIvMiwgcGFyYW1zLnRpbGUud2lkdGggKyBib3JkZXIsIHBhcmFtcy50aWxlLmhlaWdodCArIGJvcmRlcikuY2xpY2soKCk9PntcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnNlbGVjdGVkKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgc2VsZWN0ZWQgPSBmaWVsZC5nZXQob2JqZWN0LmxvYyk7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2VsZWN0ZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkID0gc2VsZWN0ZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgZiBvZiB0aGlzLnBvcnQub25zZWxlY3QpIGYodGhpcywgdGhpcy5zZWxlY3RlZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgc2VsZWN0ZWQgPSBmaWVsZC5nZXQob2JqZWN0LmxvYyk7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2VsZWN0ZWQgJiYgc2VsZWN0ZWQudGlsZSAmJiBzZWxlY3RlZC50aWxlLmxvY1swXSAhPSAtMSAmJiBzZWxlY3RlZCAhPSB0aGlzLnNlbGVjdGVkICYmICFmaWVsZC5wb3NzaWJsZSh0aGlzLnNlbGVjdGVkLnRpbGUsIG9iamVjdC5sb2MpICYmICEob2JqZWN0LmxvY1swXSA9PSB0aGlzLnNlbGVjdGVkLmxvY1swXSAmJiBvYmplY3QubG9jWzFdID09IHRoaXMuc2VsZWN0ZWQubG9jWzFdKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWQgPSBzZWxlY3RlZDtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBmIG9mIHRoaXMucG9ydC5vbnNlbGVjdCkgZih0aGlzLCB0aGlzLnNlbGVjdGVkKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNlbGVjdGVkID0gdGhpcy5zZWxlY3RlZDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgZiBvZiB0aGlzLnBvcnQub25tb3ZlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGYodGhpcywgc2VsZWN0ZWQsIGZpZWxkLmdldChvYmplY3QubG9jKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgb2JqZWN0LnJlY3RhbmdsZSA9IG9iamVjdC5hcmVhID0gYXJlYTtcclxuICAgICAgICBcclxuICAgICAgICBhcmVhLmF0dHIoe1xyXG4gICAgICAgICAgICBmaWxsOiBcInRyYW5zcGFyZW50XCJcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG9iamVjdDtcclxuICAgIH1cclxuXHJcbiAgICBidWlsZEludGVyYWN0aW9uTWFwKCl7XHJcbiAgICAgICAgbGV0IG1hcCA9IHtcclxuICAgICAgICAgICAgdGlsZW1hcDogW10sIFxyXG4gICAgICAgICAgICBncmlkbWFwOiBudWxsXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgbGV0IGdyYXBoaWMgPSB0aGlzLmdyYXBoaWM7XHJcbiAgICAgICAgbGV0IHBhcmFtcyA9IGdyYXBoaWMucGFyYW1zO1xyXG4gICAgICAgIGxldCBpbnRlcmFjdGl2ZSA9IGdyYXBoaWMuZ2V0SW50ZXJhY3Rpb25MYXllcigpO1xyXG4gICAgICAgIGxldCBmaWVsZCA9IHRoaXMuZmllbGQ7XHJcbiAgICAgICAgXHJcbiAgICAgICAgZm9yKGxldCBpPTA7aTxmaWVsZC5kYXRhLmhlaWdodDtpKyspe1xyXG4gICAgICAgICAgICBtYXAudGlsZW1hcFtpXSA9IFtdO1xyXG4gICAgICAgICAgICBmb3IobGV0IGo9MDtqPGZpZWxkLmRhdGEud2lkdGg7aisrKXtcclxuICAgICAgICAgICAgICAgIG1hcC50aWxlbWFwW2ldW2pdID0gdGhpcy5jcmVhdGVJbnRlcmFjdGlvbk9iamVjdChmaWVsZC5nZXQoW2osIGldKSwgaiwgaSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5pbnRlcmFjdGlvbk1hcCA9IG1hcDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHtJbnB1dH07XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuaW1wb3J0IHsgRmllbGQgfSBmcm9tIFwiLi9maWVsZFwiO1xyXG5pbXBvcnQgeyBUaWxlIH0gZnJvbSBcIi4vdGlsZVwiO1xyXG5cclxuY2xhc3MgTWFuYWdlciB7XHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHRoaXMuZ3JhcGhpYyA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5pbnB1dCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5maWVsZCA9IG5ldyBGaWVsZCg0LCA0KTtcclxuICAgICAgICB0aGlzLmRhdGEgPSB7XHJcbiAgICAgICAgICAgIHZpY3Rvcnk6IGZhbHNlLCBcclxuICAgICAgICAgICAgc2NvcmU6IDAsXHJcbiAgICAgICAgICAgIG1vdmVjb3VudGVyOiAwLFxyXG4gICAgICAgICAgICBhYnNvcmJlZDogMCwgXHJcbiAgICAgICAgICAgIGNvbmRpdGlvblZhbHVlOiAyMDQ4XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5vbnN0YXJ0ZXZlbnQgPSAoY29udHJvbGxlciwgdGlsZWluZm8pPT57XHJcbiAgICAgICAgICAgIHRoaXMuZ2FtZXN0YXJ0KCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLm9uc2VsZWN0ZXZlbnQgPSAoY29udHJvbGxlciwgdGlsZWluZm8pPT57XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXIuZ3JhcGhpYy5jbGVhclNob3dlZCgpO1xyXG4gICAgICAgICAgICBjb250cm9sbGVyLmdyYXBoaWMuc2hvd1Bvc3NpYmxlKHRoaXMuZmllbGQudGlsZVBvc3NpYmxlTGlzdCh0aWxlaW5mby50aWxlKSk7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXIuZ3JhcGhpYy5zaG93U2VsZWN0ZWQodGlsZWluZm8udGlsZSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLm9ubW92ZWV2ZW50ID0gKGNvbnRyb2xsZXIsIHNlbGVjdGVkLCB0aWxlaW5mbyk9PntcclxuICAgICAgICAgICAgaWYodGhpcy5maWVsZC5wb3NzaWJsZShzZWxlY3RlZC50aWxlLCB0aWxlaW5mby5sb2MpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZpZWxkLm1vdmUoc2VsZWN0ZWQubG9jLCB0aWxlaW5mby5sb2MpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb250cm9sbGVyLmdyYXBoaWMuY2xlYXJTaG93ZWQoKTtcclxuICAgICAgICAgICAgY29udHJvbGxlci5ncmFwaGljLnNob3dQb3NzaWJsZSh0aGlzLmZpZWxkLnRpbGVQb3NzaWJsZUxpc3Qoc2VsZWN0ZWQudGlsZSkpO1xyXG4gICAgICAgICAgICBjb250cm9sbGVyLmdyYXBoaWMuc2hvd1NlbGVjdGVkKHNlbGVjdGVkLnRpbGUpO1xyXG5cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vdGhpcy5ncmFwaGljLnNob3dHYW1lb3ZlcigpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5maWVsZC5vbnRpbGVhYnNvcnB0aW9uLnB1c2goKG9sZCwgdGlsZSk9PntcclxuICAgICAgICAgICAgaWYgKHRpbGUuZGF0YS5zaWRlICE9IG9sZC5kYXRhLnNpZGUpIHtcclxuICAgICAgICAgICAgICAgIHRpbGUudmFsdWUgKj0gMjtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRpbGUuZGF0YS5zaWRlID0gdGlsZS5kYXRhLnNpZGUgPT0gMSA/IDAgOiAxO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuZGF0YS5zY29yZSArPSB0aWxlLnZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLmRhdGEuYWJzb3JiZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLmdyYXBoaWMucmVtb3ZlT2JqZWN0KG9sZCk7XHJcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhpYy51cGRhdGVTY29yZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuZmllbGQub250aWxlcmVtb3ZlLnB1c2goKHRpbGUpPT57IC8vd2hlbiB0aWxlIHJlbW92ZWRcclxuICAgICAgICAgICAgdGhpcy5ncmFwaGljLnJlbW92ZU9iamVjdCh0aWxlKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmZpZWxkLm9udGlsZW1vdmUucHVzaCgodGlsZSk9PnsgLy93aGVuIHRpbGUgbW92ZWRcclxuICAgICAgICAgICAgdGhpcy5ncmFwaGljLnNob3dNb3ZlZCh0aWxlKTtcclxuICAgICAgICAgICAgaWYgKE1hdGgucmFuZG9tKCkgPD0gMC43NSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5maWVsZC5nZW5lcmF0ZVRpbGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmRhdGEuYWJzb3JiZWQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIGlmKCF0aGlzLmZpZWxkLmFueVBvc3NpYmxlKCkpIHRoaXMuZ3JhcGhpYy5zaG93R2FtZW92ZXIoKTtcclxuICAgICAgICAgICAgaWYoIHRoaXMuY2hlY2tDb25kaXRpb24oKSAmJiAhdGhpcy5kYXRhLnZpY3RvcnkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVzb2x2ZVZpY3RvcnkoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuZmllbGQub250aWxlYWRkLnB1c2goKHRpbGUpPT57IC8vd2hlbiB0aWxlIGFkZGVkXHJcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhpYy5wdXNoVGlsZSh0aWxlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgdGlsZXMoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5maWVsZC50aWxlcztcclxuICAgIH1cclxuXHJcbiAgICByZXNvbHZlVmljdG9yeSgpe1xyXG4gICAgICAgIGlmKCF0aGlzLmRhdGEudmljdG9yeSl7XHJcbiAgICAgICAgICAgIHRoaXMuZGF0YS52aWN0b3J5ID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5ncmFwaGljLnNob3dWaWN0b3J5KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIGNoZWNrQ29uZGl0aW9uKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZmllbGQuY2hlY2tBbnkodGhpcy5kYXRhLmNvbmRpdGlvblZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0VXNlcih7Z3JhcGhpY3MsIGlucHV0fSl7XHJcbiAgICAgICAgdGhpcy5pbnB1dCA9IGlucHV0O1xyXG4gICAgICAgIHRoaXMuaW5wdXQucG9ydC5vbnN0YXJ0LnB1c2godGhpcy5vbnN0YXJ0ZXZlbnQpO1xyXG4gICAgICAgIHRoaXMuaW5wdXQucG9ydC5vbnNlbGVjdC5wdXNoKHRoaXMub25zZWxlY3RldmVudCk7XHJcbiAgICAgICAgdGhpcy5pbnB1dC5wb3J0Lm9ubW92ZS5wdXNoKHRoaXMub25tb3ZlZXZlbnQpO1xyXG4gICAgICAgIGlucHV0LmF0dGFjaE1hbmFnZXIodGhpcyk7XHJcblxyXG4gICAgICAgIHRoaXMuZ3JhcGhpYyA9IGdyYXBoaWNzO1xyXG4gICAgICAgIGdyYXBoaWNzLmF0dGFjaE1hbmFnZXIodGhpcyk7XHJcblxyXG4gICAgICAgIHRoaXMuZ3JhcGhpYy5jcmVhdGVDb21wb3NpdGlvbigpO1xyXG4gICAgICAgIHRoaXMuaW5wdXQuYnVpbGRJbnRlcmFjdGlvbk1hcCgpO1xyXG5cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHJlc3RhcnQoKXtcclxuICAgICAgICB0aGlzLmdhbWVzdGFydCgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIGdhbWVzdGFydCgpe1xyXG4gICAgICAgIHRoaXMuZGF0YS5zY29yZSA9IDA7XHJcbiAgICAgICAgdGhpcy5kYXRhLm1vdmVjb3VudGVyID0gMDtcclxuICAgICAgICB0aGlzLmRhdGEuYWJzb3JiZWQgPSAwO1xyXG4gICAgICAgIHRoaXMuZmllbGQuaW5pdCgpO1xyXG4gICAgICAgIHRoaXMuZmllbGQuZ2VuZXJhdGVUaWxlKCk7XHJcbiAgICAgICAgdGhpcy5maWVsZC5nZW5lcmF0ZVRpbGUoKTtcclxuICAgICAgICB0aGlzLmRhdGEudmljdG9yeSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuZ3JhcGhpYy51cGRhdGVTY29yZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBnYW1lcGF1c2UoKXtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2FtZW92ZXIocmVhc29uKXtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgdGhpbmsoZGlmZil7IC8vPz8/XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB7TWFuYWdlcn07XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxubGV0IGttb3ZlbWFwID0gW1xyXG4gICAgWy0yLCAtMV0sXHJcbiAgICBbIDIsIC0xXSxcclxuICAgIFstMiwgIDFdLFxyXG4gICAgWyAyLCAgMV0sXHJcbiAgICBcclxuICAgIFstMSwgLTJdLFxyXG4gICAgWyAxLCAtMl0sXHJcbiAgICBbLTEsICAyXSxcclxuICAgIFsgMSwgIDJdXHJcbl07XHJcblxyXG5sZXQgcmRpcnMgPSBbXHJcbiAgICBbIDAsICAxXSwgLy9kb3duXHJcbiAgICBbIDAsIC0xXSwgLy91cFxyXG4gICAgWyAxLCAgMF0sIC8vbGVmdFxyXG4gICAgWy0xLCAgMF0gIC8vcmlnaHRcclxuXTtcclxuXHJcbmxldCBiZGlycyA9IFtcclxuICAgIFsgMSwgIDFdLFxyXG4gICAgWyAxLCAtMV0sXHJcbiAgICBbLTEsICAxXSxcclxuICAgIFstMSwgLTFdXHJcbl07XHJcblxyXG5sZXQgcGFkaXJzID0gW1xyXG4gICAgWyAxLCAtMV0sXHJcbiAgICBbLTEsIC0xXVxyXG5dO1xyXG5cclxubGV0IHBtZGlycyA9IFtcclxuICAgIFsgMCwgLTFdXHJcbl07XHJcblxyXG5cclxubGV0IHBhZGlyc05lZyA9IFtcclxuICAgIFsgMSwgMV0sXHJcbiAgICBbLTEsIDFdXHJcbl07XHJcblxyXG5sZXQgcG1kaXJzTmVnID0gW1xyXG4gICAgWyAwLCAxXVxyXG5dO1xyXG5cclxuXHJcbmxldCBxZGlycyA9IHJkaXJzLmNvbmNhdChiZGlycyk7IC8vbWF5IG5vdCBuZWVkXHJcblxyXG5sZXQgdGNvdW50ZXIgPSAwO1xyXG5cclxuY2xhc3MgVGlsZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHRoaXMuZmllbGQgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuZGF0YSA9IHtcclxuICAgICAgICAgICAgdmFsdWU6IDIsIFxyXG4gICAgICAgICAgICBwaWVjZTogMCwgXHJcbiAgICAgICAgICAgIGxvYzogWy0xLCAtMV0sIC8veCwgeVxyXG4gICAgICAgICAgICBwcmV2OiBbLTEsIC0xXSwgXHJcbiAgICAgICAgICAgIHNpZGU6IDAgLy9XaGl0ZSA9IDAsIEJsYWNrID0gMVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5pZCA9IHRjb3VudGVyKys7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGdldCB2YWx1ZSgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRhdGEudmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHZhbHVlKHYpe1xyXG4gICAgICAgIHRoaXMuZGF0YS52YWx1ZSA9IHY7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGxvYygpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRhdGEubG9jO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBsb2Modil7XHJcbiAgICAgICAgdGhpcy5kYXRhLmxvYyA9IHY7XHJcbiAgICB9XHJcblxyXG4gICAgYXR0YWNoKGZpZWxkLCB4LCB5KXtcclxuICAgICAgICBmaWVsZC5hdHRhY2godGhpcywgeCwgeSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGdldChyZWxhdGl2ZSA9IFswLCAwXSl7XHJcbiAgICAgICAgaWYgKHRoaXMuZmllbGQpIHJldHVybiB0aGlzLmZpZWxkLmdldChbXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YS5sb2NbMF0gKyByZWxhdGl2ZVswXSxcclxuICAgICAgICAgICAgdGhpcy5kYXRhLmxvY1sxXSArIHJlbGF0aXZlWzFdXHJcbiAgICAgICAgXSk7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIG1vdmUobHRvKXtcclxuICAgICAgICBpZiAodGhpcy5maWVsZCkgdGhpcy5maWVsZC5tb3ZlKHRoaXMuZGF0YS5sb2MsIGx0byk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHB1dCgpe1xyXG4gICAgICAgIGlmICh0aGlzLmZpZWxkKSB0aGlzLmZpZWxkLnB1dCh0aGlzLmRhdGEubG9jLCB0aGlzKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0IGxvYygpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRhdGEubG9jO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBzZXQgbG9jKGEpe1xyXG4gICAgICAgIHRoaXMuZGF0YS5sb2NbMF0gPSBhWzBdO1xyXG4gICAgICAgIHRoaXMuZGF0YS5sb2NbMV0gPSBhWzFdO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBjYWNoZUxvYygpe1xyXG4gICAgICAgIHRoaXMuZGF0YS5wcmV2WzBdID0gdGhpcy5kYXRhLmxvY1swXTtcclxuICAgICAgICB0aGlzLmRhdGEucHJldlsxXSA9IHRoaXMuZGF0YS5sb2NbMV07XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHNldEZpZWxkKGZpZWxkKXtcclxuICAgICAgICB0aGlzLmZpZWxkID0gZmllbGQ7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHNldExvYyhbeCwgeV0pe1xyXG4gICAgICAgIHRoaXMuZGF0YS5sb2NbMF0gPSB4O1xyXG4gICAgICAgIHRoaXMuZGF0YS5sb2NbMV0gPSB5O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICByZXBsYWNlSWZOZWVkcygpe1xyXG4gICAgICAgIGlmICh0aGlzLmRhdGEucGllY2UgPT0gMCl7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmRhdGEubG9jWzFdID49IHRoaXMuZmllbGQuZGF0YS5oZWlnaHQtMSAmJiB0aGlzLmRhdGEuc2lkZSA9PSAxKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGEucGllY2UgPSB0aGlzLmZpZWxkLmdlblBpZWNlKHRydWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmRhdGEubG9jWzFdIDw9IDAgJiYgdGhpcy5kYXRhLnNpZGUgPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhLnBpZWNlID0gdGhpcy5maWVsZC5nZW5QaWVjZSh0cnVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwb3NzaWJsZShsb2Mpe1xyXG4gICAgICAgIGlmICh0aGlzLmRhdGEucGllY2UgPT0gMCkgeyAvL1BBV05cclxuICAgICAgICAgICAgbGV0IGxpc3QgPSB0aGlzLmdldFBhd25BdHRhY2tUaWxlcygpO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBtIG9mIGxpc3QpIHtcclxuICAgICAgICAgICAgICAgIGlmKG0ubG9jWzBdID09IGxvY1swXSAmJiBtLmxvY1sxXSA9PSBsb2NbMV0pIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsaXN0ID0gdGhpcy5nZXRQYXduTW92ZVRpbGVzKCk7XHJcbiAgICAgICAgICAgIGZvciAobGV0IG0gb2YgbGlzdCkge1xyXG4gICAgICAgICAgICAgICAgaWYobS5sb2NbMF0gPT0gbG9jWzBdICYmIG0ubG9jWzFdID09IGxvY1sxXSkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgXHJcblxyXG4gICAgICAgIGlmICh0aGlzLmRhdGEucGllY2UgPT0gMSkgeyAvL0tuaWdodFxyXG4gICAgICAgICAgICBsZXQgbGlzdCA9IHRoaXMuZ2V0S25pZ2h0UG9zc2libGVUaWxlcygpO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBtIG9mIGxpc3QpIHtcclxuICAgICAgICAgICAgICAgIGlmKG0ubG9jWzBdID09IGxvY1swXSAmJiBtLmxvY1sxXSA9PSBsb2NbMV0pIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIFxyXG5cclxuICAgICAgICBpZiAodGhpcy5kYXRhLnBpZWNlID09IDIpIHsgLy9CaXNob3BcclxuICAgICAgICAgICAgZm9yIChsZXQgZCBvZiBiZGlycyl7XHJcbiAgICAgICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICAgICAgTWF0aC5zaWduKGxvY1swXSAtIHRoaXMubG9jWzBdKSAhPSBkWzBdIHx8IFxyXG4gICAgICAgICAgICAgICAgICAgIE1hdGguc2lnbihsb2NbMV0gLSB0aGlzLmxvY1sxXSkgIT0gZFsxXVxyXG4gICAgICAgICAgICAgICAgKSBjb250aW51ZTtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgbGlzdCA9IHRoaXMuZ2V0RGlyZWN0aW9uVGlsZXMoZCk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBtIG9mIGxpc3QucmV2ZXJzZSgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYobS5sb2NbMF0gPT0gbG9jWzBdICYmIG0ubG9jWzFdID09IGxvY1sxXSkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgXHJcblxyXG4gICAgICAgIGlmICh0aGlzLmRhdGEucGllY2UgPT0gMykgeyAvL1Jvb2tcclxuICAgICAgICAgICAgZm9yIChsZXQgZCBvZiByZGlycyl7XHJcbiAgICAgICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICAgICAgTWF0aC5zaWduKGxvY1swXSAtIHRoaXMubG9jWzBdKSAhPSBkWzBdIHx8IFxyXG4gICAgICAgICAgICAgICAgICAgIE1hdGguc2lnbihsb2NbMV0gLSB0aGlzLmxvY1sxXSkgIT0gZFsxXVxyXG4gICAgICAgICAgICAgICAgKSBjb250aW51ZTsgLy9Ob3QgcG9zc2libGUgZGlyZWN0aW9uXHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGxpc3QgPSB0aGlzLmdldERpcmVjdGlvblRpbGVzKGQpO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgbSBvZiBsaXN0LnJldmVyc2UoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKG0ubG9jWzBdID09IGxvY1swXSAmJiBtLmxvY1sxXSA9PSBsb2NbMV0pIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIFxyXG5cclxuICAgICAgICBpZiAodGhpcy5kYXRhLnBpZWNlID09IDQpIHsgLy9RdWVlblxyXG4gICAgICAgICAgICBmb3IgKGxldCBkIG9mIHFkaXJzKXtcclxuICAgICAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICAgICAgICBNYXRoLnNpZ24obG9jWzBdIC0gdGhpcy5sb2NbMF0pICE9IGRbMF0gfHwgXHJcbiAgICAgICAgICAgICAgICAgICAgTWF0aC5zaWduKGxvY1sxXSAtIHRoaXMubG9jWzFdKSAhPSBkWzFdXHJcbiAgICAgICAgICAgICAgICApIGNvbnRpbnVlOyAvL05vdCBwb3NzaWJsZSBkaXJlY3Rpb25cclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgbGlzdCA9IHRoaXMuZ2V0RGlyZWN0aW9uVGlsZXMoZCk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBtIG9mIGxpc3QucmV2ZXJzZSgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYobS5sb2NbMF0gPT0gbG9jWzBdICYmIG0ubG9jWzFdID09IGxvY1sxXSkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgXHJcblxyXG4gICAgICAgIGlmICh0aGlzLmRhdGEucGllY2UgPT0gNSkgeyAvL0tpbmdcclxuICAgICAgICAgICAgZm9yIChsZXQgZCBvZiBxZGlycyl7XHJcbiAgICAgICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICAgICAgTWF0aC5zaWduKGxvY1swXSAtIHRoaXMubG9jWzBdKSAhPSBkWzBdIHx8IFxyXG4gICAgICAgICAgICAgICAgICAgIE1hdGguc2lnbihsb2NbMV0gLSB0aGlzLmxvY1sxXSkgIT0gZFsxXVxyXG4gICAgICAgICAgICAgICAgKSBjb250aW51ZTsgLy9Ob3QgcG9zc2libGUgZGlyZWN0aW9uXHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGxpc3QgPSB0aGlzLmdldE5laWdodGJvclRpbGVzKGQpO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgbSBvZiBsaXN0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYobS5sb2NbMF0gPT0gbG9jWzBdICYmIG0ubG9jWzFdID09IGxvY1sxXSkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIFxyXG5cclxuICAgIGdldEtuaWdodFBvc3NpYmxlVGlsZXMoKXtcclxuICAgICAgICBsZXQgYXZhaWxhYmxlcyA9IFtdO1xyXG4gICAgICAgIGZvcihsZXQgaT0wO2k8a21vdmVtYXAubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgIGxldCBsb2MgPSBrbW92ZW1hcFtpXTtcclxuICAgICAgICAgICAgbGV0IHRpZiA9IHRoaXMuZ2V0KGxvYyk7XHJcbiAgICAgICAgICAgIGlmICh0aWYpIGF2YWlsYWJsZXMucHVzaCh0aWYpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYXZhaWxhYmxlcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0TmVpZ2h0Ym9yVGlsZXMoZGlyKXtcclxuICAgICAgICBsZXQgYXZhaWxhYmxlcyA9IFtdO1xyXG4gICAgICAgIGxldCBtYXh0ID0gTWF0aC5tYXgodGhpcy5maWVsZC5kYXRhLndpZHRoLCB0aGlzLmZpZWxkLmRhdGEuaGVpZ2h0KTtcclxuICAgICAgICBsZXQgdGlmID0gdGhpcy5nZXQoW2RpclswXSwgZGlyWzFdXSk7XHJcbiAgICAgICAgaWYgKHRpZikgYXZhaWxhYmxlcy5wdXNoKHRpZik7XHJcbiAgICAgICAgcmV0dXJuIGF2YWlsYWJsZXM7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0RGlyZWN0aW9uVGlsZXMoZGlyKXtcclxuICAgICAgICBsZXQgYXZhaWxhYmxlcyA9IFtdO1xyXG4gICAgICAgIGxldCBtYXh0ID0gTWF0aC5tYXgodGhpcy5maWVsZC5kYXRhLndpZHRoLCB0aGlzLmZpZWxkLmRhdGEuaGVpZ2h0KTtcclxuICAgICAgICBmb3IobGV0IGk9MTtpPG1heHQ7aSsrKXtcclxuICAgICAgICAgICAgbGV0IHRpZiA9IHRoaXMuZ2V0KFtkaXJbMF0gKiBpLCBkaXJbMV0gKiBpXSk7XHJcbiAgICAgICAgICAgIGlmICh0aWYpIGF2YWlsYWJsZXMucHVzaCh0aWYpO1xyXG4gICAgICAgICAgICBpZiAodGlmLnRpbGUgfHwgIXRpZikgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBhdmFpbGFibGVzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBnZXRQYXduQXR0YWNrVGlsZXMoKXtcclxuICAgICAgICBsZXQgYXZhaWxhYmxlcyA9IFtdO1xyXG4gICAgICAgIGxldCBkaXJzID0gdGhpcy5kYXRhLnNpZGUgPT0gMCA/IHBhZGlycyA6IHBhZGlyc05lZztcclxuICAgICAgICBmb3IobGV0IGk9MDtpPGRpcnMubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgIGxldCB0aWYgPSB0aGlzLmdldChkaXJzW2ldKTtcclxuICAgICAgICAgICAgaWYgKHRpZiAmJiB0aWYudGlsZSkgYXZhaWxhYmxlcy5wdXNoKHRpZik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBhdmFpbGFibGVzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBnZXRQYXduTW92ZVRpbGVzKCl7XHJcbiAgICAgICAgbGV0IGF2YWlsYWJsZXMgPSBbXTtcclxuICAgICAgICBsZXQgZGlycyA9IHRoaXMuZGF0YS5zaWRlID09IDAgPyBwbWRpcnMgOiBwbWRpcnNOZWc7XHJcbiAgICAgICAgZm9yKGxldCBpPTA7aTxkaXJzLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICBsZXQgdGlmID0gdGhpcy5nZXQoZGlyc1tpXSk7XHJcbiAgICAgICAgICAgIGlmICh0aWYgJiYgIXRpZi50aWxlKSBhdmFpbGFibGVzLnB1c2godGlmKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGF2YWlsYWJsZXM7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB7VGlsZX07XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5pbXBvcnQgeyBHcmFwaGljc0VuZ2luZSB9IGZyb20gXCIuL2luY2x1ZGUvZ3JhcGhpY3NcIjtcclxuaW1wb3J0IHsgTWFuYWdlciB9IGZyb20gXCIuL2luY2x1ZGUvbWFuYWdlclwiO1xyXG5pbXBvcnQgeyBJbnB1dCB9IGZyb20gXCIuL2luY2x1ZGUvaW5wdXRcIjtcclxuXHJcbihmdW5jdGlvbigpe1xyXG4gICAgbGV0IG1hbmFnZXIgPSBuZXcgTWFuYWdlcigpO1xyXG4gICAgbGV0IGdyYXBoaWNzID0gbmV3IEdyYXBoaWNzRW5naW5lKCk7XHJcbiAgICBsZXQgaW5wdXQgPSBuZXcgSW5wdXQoKTtcclxuXHJcbiAgICBncmFwaGljcy5hdHRhY2hJbnB1dChpbnB1dCk7XHJcbiAgICBtYW5hZ2VyLmluaXRVc2VyKHtncmFwaGljcywgaW5wdXR9KTtcclxuICAgIG1hbmFnZXIuZ2FtZXN0YXJ0KCk7IC8vZGVidWdcclxufSkoKTsiXX0=
