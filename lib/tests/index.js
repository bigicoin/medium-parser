'use strict';

var _tape = require('tape');

var _tape2 = _interopRequireDefault(_tape);

var _index = require('../index');

var _index2 = _interopRequireDefault(_index);

var _processElement = require('../processElement');

var _processElement2 = _interopRequireDefault(_processElement);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _tape2.default)('processing of html tags', function (t) {
  var html = void 0;
  var actual = void 0;
  var expected = void 0;

  html = '<strong>Para<em>graph</em></strong>';
  actual = (0, _processElement2.default)(html);
  expected = '**Para*graph***';
  t.equal(actual, expected, 'should accept recursive tags');

  html = '<blockquote>* Awesome</blockquote>';
  actual = (0, _processElement2.default)(html);
  expected = '\n> \\* Awesome';
  t.equal(actual, expected, 'should escape *');

  html = '<blockquote>- Awesome</blockquote>';
  actual = (0, _processElement2.default)(html);
  expected = '\n> \\- Awesome';
  t.equal(actual, expected, 'should escape -');

  // Tags

  html = '<p>Paragraph</p>';
  actual = (0, _processElement2.default)(html);
  expected = '\n\nParagraph';
  t.equal(actual, expected, 'should accept <p>');

  html = '<em>graph</em>';
  actual = (0, _processElement2.default)(html);
  expected = '*graph*';
  t.equal(actual, expected, 'should accept <em>');

  html = '<strong>graph</strong>';
  actual = (0, _processElement2.default)(html);
  expected = '**graph**';
  t.equal(actual, expected, 'should accept <strong>');

  html = '<a href="http://medium.com">Medium</a>';
  actual = (0, _processElement2.default)(html);
  expected = '[Medium](http://medium.com)';
  t.equal(actual, expected, 'should accept <a>');

  html = '<blockquote>This is fun</blockquote>';
  actual = (0, _processElement2.default)(html);
  expected = '\n> This is fun';
  t.equal(actual, expected, 'should accept <blockquote>');

  html = '<h4>Subtitle</h4>';
  actual = (0, _processElement2.default)(html);
  expected = '\n## Subtitle';
  t.equal(actual, expected, 'should accept <h4>');

  html = '<ul><li>Item 1</li><li>Item 2</li></ul>';
  actual = (0, _processElement2.default)(html);
  expected = '\n\n- Item 1\n- Item 2';
  t.equal(actual, expected, 'should accept <ul> and <li>');

  html = '<img src="http://google.com/doodle.jpg" alt="Doodle" />';
  actual = (0, _processElement2.default)(html);
  expected = '![Doodle](http://google.com/doodle.jpg)';
  t.equal(actual, expected, 'should accept <img>');

  html = '<figure><div><img data-src="http://google.com/doodle.jpg" /><img data-src="http://google.com/secondDoodle.jpg" /></div><figcaption>Cool</figcaption></figure>';
  actual = (0, _processElement2.default)(html);
  expected = '\n![Cool](http://google.com/secondDoodle.jpg)';
  t.equal(actual, expected, 'should accept <figure> and get second img b/c first is low-res');

  html = '<pre>function add (a, b) {\n      return a + b;\n  }</pre>';
  actual = (0, _processElement2.default)(html);
  expected = '\n~~~\nfunction add (a, b) {\n      return a + b;\n  }\n~~~\n';
  t.equal(actual, expected, 'should accept <pre>');

  t.end();
});

(0, _tape2.default)('processing the html of an medium post', function (t) {
  var actual = void 0;
  var expected = void 0;

  var html = _fs2.default.readFileSync(_path2.default.resolve(__dirname, '../../mocks/dan.html'), 'utf-8');
  var parsed = (0, _index2.default)(html);

  actual = parsed.markdown;
  expected = _fs2.default.readFileSync(_path2.default.resolve(__dirname, '../../mocks/dan.md'), 'utf-8');
  t.equal(actual, expected, 'should parse local article successfuly');

  actual = parsed.title;
  expected = 'Presentational and Container Components';
  t.equal(actual, expected, 'should parse for title');

  actual = parsed.headline;
  expected = '';
  t.equal(actual, expected, 'should parse for headline');

  actual = parsed.author;
  expected = 'Dan Abramov';
  t.equal(actual, expected, 'should parse for author');

  actual = parsed.publishedTime;
  expected = '2015-03-23T11:23:45.318Z';
  t.equal(actual, expected, 'should parse for publishedTime');

  t.end();
});

(0, _tape2.default)('author - get author from new html you-might-not-need-redux.html', function (t) {
  var actual = void 0;
  var expected = void 0;

  var html = _fs2.default.readFileSync(_path2.default.resolve(__dirname, '../../mocks/you-might-not-need-redux.html'), 'utf-8');
  var parsed = (0, _index2.default)(html);

  actual = parsed.markdown;
  expected = _fs2.default.readFileSync(_path2.default.resolve(__dirname, '../../mocks/you-might-not-need-redux.md'), 'utf-8');
  t.equal(actual, expected, 'should parse local article successfuly');

  actual = parsed.title;
  expected = 'You Might Not Need Redux';
  t.equal(actual, expected, 'should parse for title');

  actual = parsed.headline;
  expected = '';
  t.equal(actual, expected, 'should parse for headline');

  actual = parsed.author;
  expected = 'Dan Abramov';
  t.equal(actual, expected, 'should parse for author');

  actual = parsed.publishedTime;
  expected = '2016-09-19T21:30:45.266Z';
  t.equal(actual, expected, 'should parse for publishedTime');

  t.end();
});

(0, _tape2.default)('all Info - from html balancing-heuristics-and-data.html with headline', function (t) {
  var actual = void 0;
  var expected = void 0;

  var html = _fs2.default.readFileSync(_path2.default.resolve(__dirname, '../../mocks/balancing-heuristics-and-data.html'), 'utf-8');
  var parsed = (0, _index2.default)(html);

  actual = parsed.markdown;

  expected = _fs2.default.readFileSync(_path2.default.resolve(__dirname, '../../mocks/balancing-heuristics-and-data.md'), 'utf-8');

  t.equal(actual, expected, 'should parse local article successfuly');

  actual = parsed.title;
  expected = 'Balancing heuristics and data';
  t.equal(actual, expected, 'should parse for title');

  actual = parsed.headline;
  expected = 'Why a focus purely on data can miss the big picture';
  t.equal(actual, expected, 'should parse for headline');

  actual = parsed.author;
  expected = 'Skyscanner Engineering';
  t.equal(actual, expected, 'should parse for author');

  actual = parsed.publishedTime;
  expected = '2018-08-08T06:25:00.561Z';
  t.equal(actual, expected, 'should parse for publishedTime');

  t.end();
});