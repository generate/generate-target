'use strict';

require('mocha');
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var rimraf = require('rimraf');
var eachSeries = require('async-each-series');
var exists = require('fs-exists-sync');
var through = require('through2');
var Target = require('expand-target');
var App = require('base');
var target = require('..');
var app;

var fixtures = path.resolve.bind(path, __dirname, 'fixtures');
var actual = path.resolve.bind(path, __dirname, 'actual');

function base(cb) {
  return through.obj(function(file, enc, next) {
    var str = file.contents.toString();
    cb(file, str, next);
  });
}

describe('target.generate', function() {
  beforeEach(function() {
    app = new App({isApp: true});
    app.use(target());
  });

  afterEach(function(cb) {
    rimraf(actual(), cb);
  });

  describe('add target object', function() {
    it('should add a target object to app.targets', function() {
      app.target('site', {
        options: { cwd: fixtures() },
        src: 'b.txt',
        dest: actual(),
      });

      assert(app.targets.hasOwnProperty('site'));
    });

    it('should get a target object from app.targets', function() {
      app.target('site', {
        options: { cwd: fixtures() },
        src: 'b.txt',
        dest: actual()
      });

      var config = app.target('site');
      assert(app.isTarget(config));
    });
  });

  describe('add target instance', function() {
    it('should add a target object to app.targets', function() {
      app.target('site', {
        options: { cwd: fixtures() },
        src: 'b.txt',
        dest: actual()
      });
      assert(app.targets.hasOwnProperty('site'));
    });

    it('should get a target object from app.targets', function() {
      app.target('site', {
        options: { cwd: fixtures() },
        src: 'b.txt',
        dest: actual()
      });

      var config = app.target('site');
      assert(app.isTarget(config));
    });
  });

  describe('add target function', function() {
    it('should add a target function to app.targets', function() {
      app.target('site', function(opts) {
        return {
          options: { cwd: fixtures() },
          docs: {
            src: 'b.txt',
            dest: actual(),
            cwd: fixtures()
          }
        }
      });

      assert(app.targets.hasOwnProperty('site'));
    });

    it('should get a target function from app.targets', function() {
      app.target('site', function() {
        return {
          options: { cwd: fixtures() },
          docs: {
            src: 'b.txt',
            dest: actual(),
            cwd: fixtures()
          }
        }
      });

      var config = app.target('site');
      assert(app.isTarget(config));
    });
  });

  describe('.generate', function() {
    it('should get a target function and build it with the given options', function(cb) {
      app.target('foo', function(options) {
        return {
          options: { cwd: fixtures() },
          src: 'a.txt',
          dest: actual()
        }
      });

      var config = app.target('foo');
      config.generate(function(err) {
        if (err) return cb(err);
        assert(exists(actual('a.txt')));
        cb();
      });
    });

    it('should generate a target function with the given options', function(cb) {
      app.target('site', function(options) {
        return {
          options: { cwd: options.cwd },
          src: 'b.txt',
          dest: actual()
        }
      });

      var config = app.getTarget('site', {cwd: fixtures()});
      config.generate(function(err) {
        if (err) return cb(err);
        assert(exists(actual('b.txt')));
        cb();
      });
    });

    it('should generate a target function using generateStream', function(cb) {
      app.target('site', function(options) {
        return {
          options: { cwd: options.cwd },
          src: 'b.txt',
          dest: actual(),
        }
      });

      app.getTarget('site', {cwd: fixtures()})
        .generate()
        .on('error', cb)
        .on('end', function() {
          assert(exists(actual('b.txt')));
          cb();
        });
    });

    it('should generate a target function using generateSeries', function(cb) {
      app.target('site', function(options) {
        return {
          options: { cwd: options.cwd },
          src: 'b.txt',
          dest: actual()
        }
      });

      app.getTarget('site', {cwd: fixtures()})
        .generate(function(err) {
          if (err) return cb(err);
          assert(exists(actual('b.txt')));
          cb();
        })
    });

    it('should generate a target multiple times with different options', function(cb) {
      app.target('site', function(options) {
        return {
          options: { cwd: fixtures() },
          src: options.path,
          dest: actual(),
        }
      });

      eachSeries(['b.txt', 'a.txt'], function(val, next) {
        app.getTarget('site', {path: val})
          .generate(function(err) {
            if (err) return next(err);
            assert(exists(actual(val)));
            next();
          });
      }, cb);
    });

    it('should generate a target function with custom src', function(cb) {
      app.target('site', function(options) {
        return {
          options: { cwd: fixtures() },
          src: options.src,
          dest: actual()
        }
      });

      app.getTarget('site', {src: ['b.txt', 'a.txt']})
        .generate(function(err) {
          if (err) return cb(err);
          assert(exists(actual('b.txt')));
          assert(exists(actual('a.txt')));
          cb();
        });
    });
  });

  describe('target targets', function() {
    it('should process files from options.cwd', function(cb) {
      var config = new Target({
        options: { cwd: fixtures() },
        src: 'b.txt',
        dest: actual()
      });

      app.target('test', config)
        .generate(function(err) {
          if (err) return cb(err);
          assert(exists(actual('b.txt')));
          cb();
        });
    });

    it('should use the cwd passed on the config.options.cwd', function(cb) {
      assert(!exists(actual('b.txt')));

      var config = new Target({
        cwd: fixtures(),
        src: 'b.txt',
        dest: actual()
      });

      app.target('test', config)
        .generate()
        .on('error', cb)
        .on('end', function() {
          assert(exists(actual('b.txt')));
          cb();
        });
    });

    it('should work with no options:', function(cb) {
      var config = new Target({
        src: 'b.txt',
        dest: actual(),
        cwd: fixtures()
      });

      app.target('test', config)
        .generate()
        .on('error', cb)
        .on('end', function() {
          assert(exists(actual('b.txt')));
          cb();
        });
    });

    it('should process a single file', function(cb) {
      assert(!exists(actual('a.txt')));

      var config = new Target({
        cwd: fixtures(),
        src: 'a.txt',
        dest: actual()
      });

      app.target('test', config)
        .generate()
        .on('error', cb)
        .on('end', function() {
          assert(exists(actual('a.txt')));
          cb();
        });
    });

    it('should process a glob of files', function(cb) {
      assert(!exists(actual('a.txt')));
      assert(!exists(actual('b.txt')));
      assert(!exists(actual('c.txt')));

      var config = new Target({
        cwd: fixtures(),
        src: '*.txt',
        dest: actual()
      });

      app.target('test', config)
        .generate()
        .on('error', cb)
        .on('end', function() {
          assert(exists(actual('a.txt')));
          assert(exists(actual('b.txt')));
          assert(exists(actual('c.txt')));
          cb();
        });
    });
  });

  describe('target plugins', function() {
    beforeEach(function() {
      app = new App({isApp: true});
      app.use(target());
    });

    it('should use a plugin to modify file contents', function(cb) {
      app.plugin('append', function(opts) {
        opts = opts || {};
        return base(function(file, str, next) {
          file.contents = new Buffer(str + opts.suffix);
          next(null, file);
        });
      });

      var config = new Target({
        cwd: fixtures(),
        src: '*.txt',
        dest: actual()
      });

      app.target('test', config)
        .generate({suffix: 'zzz'})
        .on('error', cb)
        .on('data', function(data) {
          var str = data.contents.toString();
          var end = str.slice(-3);
          assert.equal(end, 'zzz');
        })
        .once('end', function() {
          assert(exists(actual('a.txt')));
          cb();
        });
    });

    it('should run plugins defined on config.options', function(cb) {
      function appendString(suffix) {
        return base(function(file, str, next) {
          file.contents = new Buffer(str + suffix);
          next(null, file);
        });
      }

      app.plugin('a', appendString('aaa'));
      app.plugin('b', appendString('bbb'));
      app.plugin('c', appendString('ccc'));

      var config = new Target({
        options: {pipeline: ['a', 'c']},
        cwd: fixtures(),
        src: 'a.txt',
        dest: actual()
      });

      app.target('test', config)
        .generate({suffix: 'zzz'})
        .on('error', cb)
        .on('data', function(data) {
          var str = data.contents.toString();
          assert.equal(str.indexOf('bbb'), -1);
          var end = str.slice(-6);
          assert.equal(end, 'aaaccc');
        })
        .on('finish', function() {
          assert(exists(actual('a.txt')));
          cb();
        });
    });

    it('should run plugins defined on process.options', function(cb) {
      function appendString(suffix) {
        return base(function(file, str, next) {
          file.contents = new Buffer(str + suffix);
          next(null, file);
        });
      }

      app.plugin('a', appendString('aaa'));
      app.plugin('b', appendString('bbb'));
      app.plugin('c', appendString('ccc'));

      var config = new Target({
        cwd: fixtures(),
        src: 'a.txt',
        dest: actual()
      });

      app.target('test', config)
        .generate({pipeline: ['a', 'c'], suffix: 'zzz'})
        .on('error', cb)
        .on('data', function(data) {
          var str = data.contents.toString();
          assert.equal(str.indexOf('bbb'), -1);
          var end = str.slice(-6);
          assert.equal(end, 'aaaccc');
        })
        .on('finish', function() {
          assert(exists(actual('a.txt')));
          cb();
        });
    });
  });
});

