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

//initalize the board.
//Pin has the led connected to it
//We set to be a gpio in output mode
var board = new pinja.Board({
  'p15' : {
    'type' : 'gpio',
    'direction' : 'output'
  }
});

//This function unloads the board
var done = function () {
  board.unload(function (err) {
    if (err) {
      console.log(err);
      process.exit(1);
    }
    process.exit(0);
  });
};

//We waiting for the board to get ready
board.ready(function (err) {
  var pin = board.pins.p15;

  //if an error occured during setup
  //log it and unload the board
  if (err) {
    console.log(err);
    return done();
  }

  //turn the pin on
  //wait 5 seconds
  //turn the pin off
  //unload the board
  pin.digitalWriteSync(1);
  setInterval(function () {
    pin.digitalWriteSync(0);
    done();
  }, 5000);
});
