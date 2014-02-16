
'use strict';
/*jslint node:true, indent:2, nomen:true*/
/*globals describe, it*/

var assert = require('assert');
var fs = require('fs');
var async = require('async');
var pinja = require('../pinja-pi.js');


describe('Board tests', function () {
  it('should create a board', function () {
    var b = new pinja.Board();
  });
  it('should create a new board with options', function () {
    var b = new pinja.Board({
      'p1' : {
        'type' : 'gpio',
        'mode' : pinja.OUTPUT
      }
    });
  });
  it('should create a board and pins using a custom path', function (done) {
    fs.mkdirSync(__dirname + '/fs/gpio4');
    var b = new pinja.Board({
      'p7' : {
        'type' : 'gpio',
        'mode' : pinja.OUTPUT,
        'path' : __dirname + '/fs'
      }
    });
    b.ready(function (err) {
      assert.ifError(err);
      done();
    });
  });
  it('should send the hi signal', function (done) {
    var b = new pinja.Board({
      'p7' : {
        'type' : 'gpio',
        'mode' : pinja.OUTPUT,
        'path' : __dirname + '/fs'
      }
    });
    b.ready(function (err) {
      assert.ifError(err);
      b.pins.p7.digitalWriteSync(pinja.HI);
      done();
    });
  });
  it('should read a pin', function (done) {
    var b = new pinja.Board({
      'p7' : {
        'type' : 'gpio',
        'mode' : pinja.INPUT,
        'path' : __dirname + '/fs'
      }
    });
    b.ready(function (err) {
      assert.ifError(err);
      b.pins.p7.digitalRead(function (err, val) {
        assert.ifError(err);
        assert.equal(val, 1);
        done();
      });
    });
  });
  it('should read a pin with active_low', function (done) {
    var b = new pinja.Board({
      'p7' : {
        'type' : 'gpio',
        'mode' : pinja.INPUT,
        'path' : __dirname + '/fs',
        'active' : pinja.LOW
      }
    });
    b.ready(function (err) {
      assert.ifError(err);
      b.pins.p7.digitalRead(function (err, val) {
        assert.ifError(err);
        assert.equal(val, 1);
        done();
      });
    });
  });
  it('should unload the board', function (done) {
    var b = new pinja.Board({
      'p7' : {
        'type' : 'gpio',
        'mode' : pinja.OUTPUT,
        'path' : __dirname + '/fs'
      }
    });
    b.ready(function (err) {
      assert.ifError(err);
      b.unload(function (err) {
        assert.ifError(err);
        done();
      });
    });
  });
});

describe('clean up', function () {
  it('should remove the files', function (done) {
    async.series([
      /*
      function (cb) {
        fs.unlink(__dirname + '/fs/export', function (err) {
          cb(err);
        });
      },
      */
      function (cb) {
        fs.unlink(__dirname + '/fs/unexport', function (err) {
          cb(err);
        });
      },
      function (cb) {
        fs.unlink(__dirname + '/fs/gpio4/value', function (err) {
          cb(err);
        });
      },
      function (cb) {
        fs.unlink(__dirname + '/fs/gpio4/direction', function (err) {
          cb(err);
        });
      },
      function (cb) {
        fs.unlink(__dirname + '/fs/gpio4/edge', function (err) {
          cb(err);
        });
      },
      function (cb) {
        fs.unlink(__dirname + '/fs/gpio4/active_low', function (err) {
          cb(err);
        });
      },
      function (cb) {
        fs.rmdir(__dirname + '/fs/gpio4', function (err) {
          cb(err);
        });
      }
    ], function (err) {
      assert.ifError(err);
      done();
    });
  });
});
