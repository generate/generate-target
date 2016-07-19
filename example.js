'use strict';

var target = require('./');
var Base = require('base-app');
var app = new Base();

app.use(target());

// app.on('target', function(target) {
//   app.task(target.name, function(cb) {
//     target.generate(cb);
//   });
// });

app.target('site', {
  options: {},
  files: {
    src: ['*', '!**/foo/**', '!**/node_modules/**'],
    dest: 'test/actual/site'
  }
});

app.target('docs', {
  options: {},
  files: {
    src: ['*', '!**/foo/**', '!**/node_modules/**'],
    dest: 'test/actual/docs'
  }
});

// var target = app.target({
//   options: {},
//   files: {
//     src: ['*', '!**/foo/**', '!**/node_modules/**'],
//     dest: 'docs'
//   }
// });

// console.log(app.target('site').files);
// console.log(app.target('docs').files);
// console.log(target.files);

// app.target('docs')
//   .generate()
//   .on('end', function() {
//     console.log('done!');
//   });

// app.target('site')
//   .generate(function(err) {
//     if (err) return console.log(err);
//     console.log('done');
//   });

app.build(['site', 'docs'], function(err) {
  if (err) return console.log(err);
  console.log('done');
});
