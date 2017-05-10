'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _multer = require('multer');

var _multer2 = _interopRequireDefault(_multer);

var _invertedIndex = require('../src/inverted-index');

var _invertedIndex2 = _interopRequireDefault(_invertedIndex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

var index = new _invertedIndex2.default();
var upload = (0, _multer2.default)({ dest: '../fixtures' });

_dotenv2.default.config();

var NODE_ENV = process.env.NODE_ENV;

if (NODE_ENV === 'PROD') {
  app.set('PORT', process.env.PORT_PROD);
} else if (NODE_ENV === 'DEV') {
  app.set('PORT', process.env.PORT_DEV);
} else {
  app.set('PORT', process.env.PORT_TEST);
}

app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: true }));

app.post('/api/createIndex', upload.single('Books'), function (req, res) {
  res.send(index.createIndex(req.file, req.body));
  res.send(index.getIndex(req.body));
});

app.post('/api/searchIndex', function (req, res) {
  res.send(index.searchIndex(req.body[0], req.body[1]));
});

app.post('/isJson', function (req, res) {
  res.send(index.isJson(req.body));
});
var port = app.get('PORT');
var server = app.listen(process.env.PORT || port, function () {
  return console.log('LISTENING ON PORT ' + port + '...');
});
exports.default = server;