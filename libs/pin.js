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
/*jslint node:true, indent:2, nomen:true, stupid:true*/

var pinMap = require('./pinMap.js');
var pinja = require('./constants.js');
var fs = require('fs');
var async = require('async');

//Parameters:
//  name : <String> P1, ..., P26
//  opts:
//    revision: <String> [rev1 || rev2] board revision types
//    type : [Optional default=gpio] <String> gpio only supported at this time
//    direction : <String> in | out
//    path : [Optional default=/sys/class/gpio] <String> Path to gpio
function Pin(name, opts) {
  if (!(this instanceof Pin)) {
    return new Pin(name, opts);
  }
  this.name = name;
  var pin = pinMap[opts.revision][name];
  this.log = opts.log;
  if (pin === undefined) {
    throw new Error('Pin \'' + this.name + '\' is not defined.');
  }
  if (pin.gpio === undefined) {
    throw new Error('Pin \'' + this.name + '\' is not a GPIO.');
  }
  this._pin = pin.gpio;
  this._type = 'gpio';
  this._edge = pinja.edge.NONE;

  this._direction = pinja.OUTPUT;
  if (opts.direction === pinja.INPUT) {
    this._direction = pinja.INPUT;
  }
  this.active = opts.active || pinja.HI;
  this._path = opts.path || '/sys/class/gpio';
}

Pin.prototype.attachInterrupt = function (next) {
};

Pin.prototype.detachInterrupt = function (next) {
};

Pin.prototype.digitalRead = function (next) {
  var self = this,
    path = this._path + '/gpio' + this._pin + '/value';
  self.log.debug('Reading ' + path);
  fs.readFile(path, 'utf8', function (err, data) {
    next(err, data);
  });
};

Pin.prototype.digitalReadySync = function (val) {
  var self = this,
    path = this._path + '/gpio' + this._pin + '/value';
  self.log.debug('Reading Sync ' + path);
  return fs.readFileSync(path, 'utf8');
};

//Params:
//  val : <Int> pinja.HI || pinja.LOW
//  next : <Function <Error>> Callback (err)
Pin.prototype.digitalWrite = function (val, next) {
  if (val !== pinja.HI && val !== pinja.LOW) {
    return next(new Error('Invalid value'));
  }
  var path = this._path + '/gpio' + this._pin + '/value';
  this.log.debug('Writing ' + path + ' value=' + val);
  fs.writeFile(path, val, function (err) {
    next(err);
  });
};

//Params:
//  val : <Int> pinja.HI || pinja.LOW
Pin.prototype.digitalWriteSync = function (val) {
  if (val !== pinja.HI && val !== pinja.LOW) {
    throw new Error('Invalid value');
  }
  var path = this._path + '/gpio' + this._pin + '/value';
  this.log.debug('Writing ' + path + ' value=' + val);
  fs.writeFileSync(path, val);
};

Pin.prototype.setEdge = function (val, next) {
  if (
    val !== pinja.edge.RISING &&
      val !== pinja.edge.FALLING &&
      val !== pinja.edge.BOTH &&
      val !== pinja.edge.NONE
  ) {
    return next(new Error('Invalid edge'));
  }
  var path = this._path + '/gpio' + this._pin + '/edge';
  this.log.debug('Writing ' + path + ' value=' + val);
  fs.writeFile(path, val, function (err) {
    next(err);
  });
};

Pin.prototype.setDirection = function (next) {
  var path = this._path + '/gpio' + this._pin + '/direction';
  this.log.debug('Writing' + path + ' value='  + this._direction);
  fs.writeFile(path, this._direction, function (err) {
    next(err);
  });
};

Pin.prototype.setActive = function (next) {
  var path = this._path + '/gpio' + this._pin + '/active_low';
  this.log.debug('Writing ' + path + ' value=' + this.active);
  fs.writeFile(path, this.active, function (err) {
    next(err);
  });
};

Pin.prototype.init = function (next) {
  var self = this;
  async.waterfall([
    function (cb) {
      self.log.info('Initalizing ' + self.name);
      fs.exists(self._path + '/gpio' + self._pin, function (exsits) {
        cb(null, exsits);
      });
    },
    function (exsits, cb) {
      if (exsits) {
        self.log.debug(self.name + ' exsits. Skipping export');
        return cb();
      }
      self.log.debug('Exporting ' + self.name);
      fs.writeFile(self._path + '/export', self._pin, function (err) {
        cb(err);
      });
    },
    function (call) {
      async.parallel([
        function (cb) {
          self.setEdge(pinja.edge.NONE, cb);
        },
        function (cb) {
          self.setDirection(cb);
        },
        function (cb) {
          self.setActive(cb);
        }
      ], function (err) {
        call(err);
      });
    }
  ], function (err) {
    self.log.info(self.name + ' initalized.');
    next(err);
  });
};

Pin.prototype.unexport = function (next) {
  fs.writeFile(this._path + '/unexport', this._pin, function (err) {
    next(err);
  });
};

module.exports = Pin;
