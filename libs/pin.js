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

var pinMap = require('./pinMap.js');
var pinja = require('../pinja-pi.js');
var fs = require('fs');

//Parameters:
//  name : <String> P1, ..., P26
//  opts:
//    type : [Optional default=gpio] <String> gpio only supported at this time
//    mode : <String> in | out
//    path : [Optional default=/sys/class/gpio] <String> Path to gpio
function Pin(name, opts) {
  if (!(this instanceof Pin)) {
    return new Pin(name, opts);
  }
  this.name = name;
  var pin = pinMap[name];
  if (pin === undefined) {
    throw new Error('Pin \'' + this.name + '\' is not defined.');
  }
  if (pin === null) {
    throw new Error('Pin \'' + this.name + '\' is not a GPIO.');
  }
  this._pin = pin;
  this._type = 'gpio';

  this._mode = pinja.OUTPUT;
  if (opts.mode === pinja.INPUT) {
    this._mode = pinja.INPUT;
  }
  this._path = opts.path || '/sys/class/gpio';
}

Pin.prototype.attachInterrupt = function (next) {
};

Pin.prototype.detachInterrupt = function (next) {
};

Pin.prototype.digitalRead = function (val, next) {
};

Pin.prototype.digitalReadySync = function (val) {
};

//Params:
//  val : <Int> pinja.HI || pinja.LOW
//  next : <Function <Error>> Callback (err)
Pin.prototype.digitalWrite = function (val, next) {
  if (val !== pinja.HI || val !== pinja.LOW) {
    return next(new Error('Invalid value'));
  }
  fs.writeFile(this._path + '/gpio' + this._pin + '/value', val, function (err) {
    next(err);
  });
};

//Params:
//  val : <Int> pinja.HI || pinja.LOW
Pin.prototype.digitalWriteSync = function (val) {
  if (val !== pinja.HI || val !== pinja.LOW) {
    throw new Error('Invalid value');
  }
  fs.writeFileSync(this._path + '/gpio' + this._pin + '/value', val);
};

Pin.prototype.init = function (next) {
  //export the pin
  fs.writeFile(this._path + '/export', this._pin, function (err) {
    next(err);
  });
};

Pin.prototype.unexport = function (next) {
  fs.writeFile(this._path + '/unexport', this._pin, function (err) {
    next(err);
  });
};

module.exports = Pin;
