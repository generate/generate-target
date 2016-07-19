## Usage

Can be used with any [base][] application, including [assemble][], [generate][], and [update][].

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

See the [expand-target][] library for additional information and API documentation.

## API

### [.targetSeries](index.js#L86)
Asynchronously generate files from a declarative [target][expand-target] configuration.

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
Generate files from a declarative [target][expand-target] configuration.

**Params**

* `target` **{Object}**: [target][expand-target] configuration object.    
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

[assemble]: https://github.com/assemble/assemble
[base]: https://github.com/node-base/base
[expand-target]: https://github.com/jonschlinkert/expand-target
[generate-dest]: https://github.com/generate/generate-dest
[generate-install]: https://github.com/generate/generate-install
[generate]: https://github.com/generate/generate
[gulp]: http://gulpjs.com
[update]: https://github.com/update/update