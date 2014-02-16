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
var pinja = require('../pinja-pi.js');

var board = new pinja.Board({
  'p11' : {
    'direction' : 'output'
  },
  'p13' : {
    'direction' : 'output'
  },
  'p15' : {
    'direction' : 'output'
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
  var red, green, blue, delay;
  red = board.pins.p11;
  green = board.pins.p13;
  blue = board.pins.p15;

  if (err) {
    console.log(err);
    return exit();
  }

  //helper function
  delay = function (cb) {
    setTimeout(function () {
      cb();
    }, 5000);
  };
  
  async.series([
    function (cb) {
      red.digitalWrite(pinja.HI, function (err) {
        console.log('red on');
        cb(err);
      });
    },
    delay,
    function (cb) {
      green.digitalWrite(pinja.HI, function (err) {
        console.log('green on');
        cb(err);
      });
    },
    delay,
    function (cb) {
      blue.digitalWrite(pinja.HI, function (err) {
        console.log('blue on');
        cb(err);
      });
    },
    delay,
    function (cb) {
      async.parallel([
        function (call) {
          red.digitalWrite(pinja.LOW, call);
        },
        function (call) {
          green.digitalWrite(pinja.LOW, call);
        },
        function (call) {
          blue.digitalWrite(pinja.LOW, call);
        }
      ], function (err) {
        cb(err);
      });
    }
  ], function (err) {
    if (err) { console.log(err); }
    exit();
  });
});
