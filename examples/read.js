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

var pinja = require('../pinja-pi.js');
var async = require('async');

var board = new pinja.Board({
  'p3' : {
    'direction' : pinja.INPUT
  }
});
var exit = function () {
  board.unload(function (err) {
    if (err) {
      console.log(err);
      process.exit(1);
    }
    process.exit(0);
  });
};

board.ready(function (err) {
  var pin = board.pins.p3;

  if (err) {
    console.log(err);
    return exit();
  }

  async.series([
    function (cb) {
      //Read the value when the pin is active hi (default)
      pin.digitalRead(function (err, val) {
        if (err) { cb(err); }
        console.log('Value:' + val);
        cb();
      });
    },
    function (cb) {
      pin.active = pinja.LOW;
      pin.setActive(cb);
    },
    function (cb) {
      //Read the value when it's active low
      pin.digitalRead(function (err, val) {
        if (err) { return cb(err); }
        console.log('Value:' + val);
        cb();
      });
    },
  ], function (err) {
    if (err) {
      console.log(err);
    }
    exit();
  });
});
