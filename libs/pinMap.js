//Copyright 2013 ERAS/Educational Research and Services
//Reproduction of this material strictly prohibited.
//Written by Ryan Lee

'use strict';
/*jslint node:true, indent:2, nomen:true*/

var utils = require('util');

var rev2 = {
  'p1':  {
    'name' : '3V3',
  },
  'p2':  {
    'name' : '5V',
  },
  'p3':  {
    'name' : 'GPIO 2, SDA',
    'gpio' : 2,
    'i2c' : 'sda'
  },
  'p4': {
    'name' : '5v',
  },
  'p5':  {
    'name' : 'GPIO 3, SCL',
    'gpio' : 3,
    'i2c' : 'scl'
  },
  'p6':  {
    'name' : 'ground',
  },
  'p7':  {
    'name' : 'GPIO 4',
    'gpio' : 4,
  },
  'p8':  {
    'name' : 'GPIO 14, UART serial data transmit',
    'gpio' : 14,
    'uart' : 'transmit'
  },
  'p9':  {
    'name' : 'ground',
  },
  'p10': {
    'name' : 'GPIO 14, UART serial data receive',
    'gpio' : 15,
    'uart' : 'receive'
  },
  'p11': {
    'name' : 'GPIO 17',
    'gpio' : 17
  },
  'p12': {
    'name' : 'GPIO 18',
    'gpio' : 18
  },
  'p13': {
    'name' : 'GPIO 27',
    'gpio' : 27
  },
  'p14': {
    'name' : 'ground'
  },
  'p15': {
    'name' : 'GPIO 22',
    'gpio' : 22
  },
  'p16': {
    'name' : 'GPIO 23',
    'gpio' : 23
  },
  'p17': {
    'name' : '3V3'
  },
  'p18': {
    'name' : 'GPIO 24',
    'gpio' : 24
  },
  'p19': {
    'name' : 'GPIO 10, SPI0 MOSI',
    'gpio' : 10
  },
  'p20': {
    'name' : 'ground',
  },
  'p21': {
    'name' : 'GPIO 9, SPI MISO',
    'gpio' : 9,
    'spi' : 'miso'
  },
  'p22': {
    'name' : 'GPIO 25',
    'gpio' : 25
  },
  'p23': {
    'name' : 'GPIO 11, SPI SCLK',
    'gpio' : 11,
    'spi' : 'sclk'
  },
  'p24': {
    'name' : 'GPIO 8, SPI CE0',
    'gpio' : 8,
    'spi' : 'ce0'
  },
  'p25': {
    'name' : 'ground',
  },
  'p26': {
    'name' : 'GPIO 7, SPI0 CE1',
    'gpio' : 7,
    'spi' : 'ce1'
  }
};

var rev1 = utils._extend({}, rev2);
rev1.p3 = {
  'name' : 'GPIO 0',
  'gpio' : 0,
  'i2c' : 'sda'
};
rev1.p5 = {
  'name' : 'GPIO 1',
  'gpio' : 1,
  'i2c' : 'scl'
};
rev1.p13 = {
  'name' : 'GPIO 21',
  'gpio' : 21
};

module.exports = {
  'rev1' : rev1,
  'rev2' : rev2
};
