//Copyright 2014 Ryan Lee
//
//Licensed under the Apache License, Version 2.0 (the "License");
//you may not use this file except in compliance with the License.
//You may obtain a copy of the License at
//
//http://www.apache.org/licenses/LICENSE-2.0
//
//Unless required by applicable law or agreed to in writing, software
//distributed under the License is distributed on an "AS IS" BASIS,
//WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//See the License for the specific language governing permissions and
//limitations under the License.

'use strict';
/*jslint node:true, indent:2, nomen:true*/

var async = require('async');
var Pin = require('./pin.js');

function Board(pins, opts) {
  if (!(this instanceof Board)) {
    return new Board(pins, opts);
  }
  if (!opts) { opts = {}; }

  this._ready = false;
  this._rawPins = pins;
  this.pins = {};

  //parse the options
  this.path = opts.path;
  if (!opts.log) { opts.log = {}; }
  this.log = {
    'debug' : opts.log.debug || function () {},
    'info' : opts.log.info || function () {},
    'warn' : opts.log.warn || function () {},
    'error' : opts.log.error || function () {}
  };
}

Board.prototype.ready = function (next) {
  var self = this;
  async.each(
    Object.keys(this._rawPins),
    function (p, iterate) {
      self.pins[p] = new Pin(p, self._rawPins[p]);
      self.pins[p].init(function (err) {
        if (err) { return iterate(err); }
        self.log.debug('Pin ' + p + ' created.');
        iterate();
      });
    },
    function (err) {
      if (err) { return next(err); }
      self.log.debug('Board ready.');
      next(err);
    }
  );
};

Board.prototype.unload = function (next) {
  var self = this;
  async.each(
    Object.keys(this.pins),
    function (p, iterate) {
      self.pins[p].unexport(function (err) {
        if (err) { return iterate(err); }
        delete self.pins[p];
        self.log.debug('Pin ' + p + ' destroyed.');
        iterate();
      });
    },
    function (err) {
      if (err) { return next(err); }
      self.log.debug('Board Unloaded.');
      next(err);
    }
  );
};

module.exports = Board;
