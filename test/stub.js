
'use strict';
/*jslint node:true, indent:2, nomen:true*/
/*globals describe, it*/

var assert = require('assert');
var fs = require('fs');
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
});

describe('clean up', function () {
  it('should remove the files', function (done) {
    fs.unlink(__dirname + '/fs/export', function (err) {
      assert.ifError(err);
      done();
    });
  });
});
