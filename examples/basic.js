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

var pinja = require('pinja-pi')

//initalize the board.
//Pin has the led connected to it
//We set to be a gpio in output mode
var board = pinja.board({
  'p11' : {
    'type' : 'gpio',
    'mode' : 'output'
  }
});

//make a shorthand for p11
var p11 = board.pins.p11;

//Do not use p11 here. It is not initalized untill you call ready

//We waiting for the board to get ready
board.ready(function(err) {
  //handle any errors that occured
  if (err) {
    console.log(err);
    process.exit(1);
  }
  
  p11.digitalWriteSync(1);
  setInterval(function () {
    p11.digitalWriteSync(0);
  }, 5000);
});
