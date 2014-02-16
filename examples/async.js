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
}, {
  'log' : {
    'debug' : function (message) {
      console.log(message);
    }
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
  var red, green, blue;
  red = board.pins.p11;
  green = board.pins.p13;
  blue = board.pins.p15;
  
  if (err) {
    console.log(err);
    return exit();
  }
  
  async.series([
    function (cb) {
      red.digitalWrite(pinja.HI, function (err) {
        console.log('red on');
        if (err) { return cb(err); }
        setInterval(function () {
          console.log('turning on green');
          cb();
        }, 5000);
      });
    },
    function (cb) {
      green.digitalWrite(pinja.HI, function (err) {
        console.log('green on');
        if (err) { return cb(err); }
        setInterval(function () {
          console.log('turning on blue');
          cb();
        }, 5000);
      });
    },
    function (cb) {
      blue.digitalWrite(pinja.HI, function (err) {
        console.log('blue on');
        if (err) { 
          console.log(err);
          return cb(err); 
        }
        setInterval(function () {
          console.log('turning off pins');
          cb();
        }, 5000);
      });
    },
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
