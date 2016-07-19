'use strict';

var each = require('base-files-each');
var isValid = require('is-valid-app');
var target = require('base-target');
var merge = require('mixin-deep');

module.exports = function(options) {
  options = options || {};

  return function(app) {
    if (!isValid(app, 'generate-target')) return;

    /**
     * Plugins
     */

    this.use(target());
    this.use(each());

    /**
     * Dynamically create tasks for each target
     */

    if (typeof this.task === 'function' && options.tasks !== false) {
      this.on('target', function(target) {
        app.task(target.name, function(cb) {
          target.generate(cb);
        });
      });
    }

    /**
     * Listen for `target`, decorate methods for generating target files
     */

    this.on('target', function(target) {
      if (typeof target.generate === 'function') return;

      target.define('generate', function(options, cb) {
        if (typeof options === 'function') {
          cb = options;
          options = {};
        }
        if (typeof cb === 'function') {
          return this.generateSeries.apply(this, arguments);
        }
        return this.generateStream.apply(this, arguments);
      });

      target.define('generateSeries', function(options, cb) {
        var args = [].slice.call(arguments);
        args.unshift(this);
        return app.targetSeries.apply(app, args);
      });

      target.define('generateStream', function() {
        var args = [].slice.call(arguments);
        args.unshift(this);
        return app.targetStream.apply(app, args);
      });
    });

    this.define({

      /**
       * Asynchronously generate files from a declarative [target][expand-target] configuration.
       *
       * ```js
       * var Target = require('target');
       * var target = new Target({
       *   options: {cwd: 'source'},
       *   src: ['content/*.md']
       * });
       *
       * app.targetSeries(target, function(err) {
       *   if (err) console.log(err);
       * });
       * ```
       * @name .targetSeries
       * @param {Object} `target` Target configuration object.
       * @param {Function} `next` Optional callback function. If not passed, `.targetStream` will be called and a stream will be returned.
       * @api public
       */

      targetSeries: function(target, options, next) {
        if (typeof options === 'function') {
          next = options;
          options = {};
        }
        if (typeof next !== 'function') {
          return this.targetStream(target, options);
        }

        var opts = merge({}, this.options, options);
        return this.each(target, opts, next);
      },

      /**
       * Generate files from a declarative [target][expand-target] configuration.
       *
       * ```js
       * var Target = require('target');
       * var target = new Target({
       *   options: {},
       *   files: {
       *     src: ['*'],
       *     dest: 'foo'
       *   }
       * });
       *
       * app.targetStream(target)
       *   .on('error', console.error)
       *   .on('end', function() {
       *     console.log('done!');
       *   });
       * ```
       * @name .targetStream
       * @param {Object} `target` [target][expand-target] configuration object.
       * @return {Stream} returns a stream with all processed files.
       * @api public
       */

      targetStream: function(target, options, cb) {
        return this.eachStream(target, options);
      }
    });
  };
};
