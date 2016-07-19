# generate-target [![NPM version](https://img.shields.io/npm/v/generate-target.svg?style=flat)](https://www.npmjs.com/package/generate-target) [![NPM downloads](https://img.shields.io/npm/dm/generate-target.svg?style=flat)](https://npmjs.org/package/generate-target) [![Build Status](https://img.shields.io/travis/jonschlinkert/generate-target.svg?style=flat)](https://travis-ci.org/jonschlinkert/generate-target)

Plugin for automatically creating tasks from declarative `target` configurations. Works with generate, assemble, verb, or any other base application with plugin support.

## What is generate?

Generate is a command line tool and developer framework for scaffolding out new GitHub projects using [generators](https://github.com/generate/generate/blob/master/docs/generators.md) and [tasks](https://github.com/generate/generate/blob/master/docs/tasks.md). Answers to prompts and the user's environment can be used to determine the templates, directories, files and contents to build. Support for [gulp](http://gulpjs.com), [base](https://github.com/node-base/base) and [assemble](https://github.com/assemble/assemble) plugins, and much more.

For more information about Generate:

* Visit the [generate project](https://github.com/generate/generate)
* Visit the [generate documentation](https://github.com/generate/generate/blob/master/docs/)
* Find [generators on npm](https://www.npmjs.com/browse/keyword/generate-generator) (help us [author generators](https://github.com/generate/generate/blob/master/docs/micro-generators.md))

## Usage

Can be used with any [base](https://github.com/node-base/base) application, including [assemble](https://github.com/assemble/assemble), [generate](https://github.com/generate/generate), and [update](https://github.com/update/update).

```js
var target = require('generate-target');
```

## Example

```js
var Base = require('base');
var targets = require('base-target');
var app = new Base({isApp: true}); 
app.use(targets());

// create a target
app.target('abc', {
  src: 'templates/*.hbs',
  dest: 'site',
});

// get a target
app.target('abc')
  .generate({cwd: 'fo'}) // build the files in a target
  .on('error', console.error)
  .on('end', function() {
    console.log('done!');
  });
```

See the [expand-target](https://github.com/jonschlinkert/expand-target) library for additional information and API documentation.

## API

### [.targetSeries](index.js#L86)

Asynchronously generate files from a declarative [target](https://github.com/jonschlinkert/expand-target) configuration.

**Params**

* `target` **{Object}**: Target configuration object.
* `next` **{Function}**: Optional callback function. If not passed, `.targetStream` will be called and a stream will be returned.

**Example**

```js
var Target = require('target');
var target = new Target({
  options: {cwd: 'source'},
  src: ['content/*.md']
});

app.targetSeries(target, function(err) {
  if (err) console.log(err);
});
```

### [.targetStream](index.js#L124)

Generate files from a declarative [target](https://github.com/jonschlinkert/expand-target) configuration.

**Params**

* `target` **{Object}**: [target](https://github.com/jonschlinkert/expand-target) configuration object.
* `returns` **{Stream}**: returns a stream with all processed files.

**Example**

```js
var Target = require('target');
var target = new Target({
  options: {},
  files: {
    src: ['*'],
    dest: 'foo'
  }
});

app.targetStream(target)
  .on('error', console.error)
  .on('end', function() {
    console.log('done!');
  });
```

## Tasks

If the instance has a `task` method, a task is automatically created for each target.

**Example**

```js
app.target('docs', {src: 'src/docs/*.md', dest: 'docs'});
app.target('site', {src: 'src/site/*.hbs', dest: 'site'});

app.build(['docs', 'site'], function(err) {
  if (err) return console.log(err);
  console.log('done!');
});
```

**Disable auto-tasks**

Pass options to the plugin to disable this feature.

```js
app.use(targets({tasks: false}));
```

## CLI

**Help**

Get general help and a menu of available commands:

```sh
$ gen help
```

**Running the `target` generator**

Once both [generate](https://github.com/generate/generate) and `generate-target` are installed globally, you can run the generator with the following command:

```sh
$ gen target
```

If completed successfully, you should see both `starting` and `finished` events in the terminal, like the following:

```sh
[00:44:21] starting ...
...
[00:44:22] finished ✔
```

If you do not see one or both of those events, please [let us know about it](../../issues).

## API

### Install locally

If you want to use `generate-target` as a plugin or sub-generator to extend the features and settings in your own generator, you must first install it locally:

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install --save generate-target
```

### Use as a plugin

Use as a [plugin](https://github.com/generate/generate/blob/master/docs/plugins.md) if you want to extend your own generator with the features, settings and tasks of `generate-target`, as if they were created on your generator:

```js
module.exports = function(app) {
  app.use(require('generate-target'));
};
```

Visit Generate's [plugin docs](https://github.com/generate/generate/blob/master/docs/plugins.md) to learn more about plugins.

### Use as a sub-generator

Use as a [sub-generator](https://github.com/generate/generate/blob/master/docs/generators.md) if you want to add `generate-target` to a  _namespace_ in your generator:

```js
module.exports = function(app) {
  // register the generate-target with whatever name you want
  app.register('foo', require('generate-target'));
};
```

Visit Generate's [sub-generator docs](https://github.com/generate/generate/blob/master/docs/sub-generators.md) to learn more about sub-generators.

## About

### Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](../../issues/new).

### Running tests

Install dev dependencies:

```sh
$ npm install -d && npm test
```

### Author

**Jon Schlinkert**

* [github/jonschlinkert](https://github.com/jonschlinkert)
* [twitter/jonschlinkert](http://twitter.com/jonschlinkert)

### License

Copyright © 2016, [Jon Schlinkert](https://github.com/jonschlinkert).
Released under the [MIT license](https://github.com/jonschlinkert/generate-target/blob/master/LICENSE).

***

_This file was generated by [verb](https://github.com/verbose/verb), v0.9.0, on July 19, 2016._