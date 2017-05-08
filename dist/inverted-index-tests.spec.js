'use strict';

var _invertedIndex = require('../src/inverted-index');

var _invertedIndex2 = _interopRequireDefault(_invertedIndex);

var _books = require('../fixtures/books.json');

var _books2 = _interopRequireDefault(_books);

var _invalidBook = require('../fixtures/invalidBook.json');

var _invalidBook2 = _interopRequireDefault(_invalidBook);

var _book = require('../fixtures/book1.json');

var _book2 = _interopRequireDefault(_book);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import badBooks from '../fixtures/badBooks.json';

// import jasmine from 'jasmine-node';
describe('Read book data', function () {
  it('should not be empty', function () {
    var index = new _invertedIndex2.default(_books2.default);

    expect(index.isJson(_books2.default)).toBe(true);
  });

  it('should be a valid json file', function () {
    var index = new _invertedIndex2.default(_books2.default);

    expect(index.isJson(_books2.default)).toBeTruthy();
  });

  it('should throw error for malformed file', function () {
    var index = new _invertedIndex2.default(_invalidBook2.default);

    expect(index.isJson(_invalidBook2.default)).toBe(Error('malformed file'));
  });
});

describe('Populate Index', function () {
  describe('when a Valid JSON is passed to create index', function () {
    it('should return correct index', function () {
      var index = new _invertedIndex2.default();
      var fileName = 'book1';
      var result = { book1: { 1998: [0],
          digital: [0],
          fortress: [0],
          is: [0],
          a: [0],
          techno: [0],
          thriller: [0],
          novel: [0],
          written: [0],
          by: [0],
          american: [0],
          author: [0],
          dan: [0],
          brown: [0],
          and: [0],
          published: [0],
          in: [0],
          st: [0],
          '': [0],
          martin: [0],
          s: [0],
          press: [0] } };

      expect(index.createIndex(fileName, _book2.default)).toEqual(result);
    });

    it('should not create index if file is an invalid json', function () {
      var index = new _invertedIndex2.default();
      var fileName = 'invalid';

      expect(index.createIndex(fileName, _invalidBook2.default)).toThrow(Error('malformed file'));
    });
  });
});

describe('Search Index', function () {
  it('should return correct result from index when', function () {
    var index = new _invertedIndex2.default();
    var fileName = 'books';
    var result = { books: { unusual: [0], murder: [0] } };
    index.createIndex(fileName, _books2.default);

    expect(index.searchIndex(fileName, 'unusual', 'murder')).toEqual(result);
  });

  it('should be able to handle an array of argumets', function () {
    var index = new _invertedIndex2.default();
    var fileName = 'books';
    index.createIndex(fileName, _books2.default);
    var result = { books: { unusual: [0],
        murder: [0],
        spy: [1],
        his: [0, 1],
        salander: [0],
        jason: [1],
        bourne: [1],
        vanger: [0] } };

    expect(index.searchIndex(fileName, ['unusual', 'murder', 'spy', 'his', 'Salander', ['jason', 'bourne'], 'Vanger'])).toEqual(result);
  });

  it('should handle a varied number of search terms as arguments', function () {
    var index = new _invertedIndex2.default();
    var fileName = 'Digital Fortress';
    index.createIndex(fileName, _book2.default);
    var result = { 'Digital Fortress': { american: [0], thriller: [0], author: [0], brown: [0] } };

    expect(index.searchIndex(fileName, 'American', 'thriller', 'author', 'Brown')).toEqual(result);
  });

  it('should ensure searchIndex goes through all indexed files if a filename/key is not passed.', function () {
    var index = new _invertedIndex2.default();
    var fileName = 'Digital Fortress';
    index.createIndex(fileName, _book2.default);
    var result = { 'Digital Fortress': { american: [0], thriller: [0], author: [0], brown: [0] } };

    expect(index.searchIndex(['American', 'thriller', 'author', 'Brown'])).toEqual(result);
  });

  it('should return message: `Term not found` if search term not in index', function () {
    var index = new _invertedIndex2.default();
    var fileName = 'Books';
    index.createIndex(fileName, _books2.default);
    var result = { Books: { american: ['Term not found'],
        thriller: [1],
        author: ['Term not found'],
        brown: ['Term not found'] } };
    expect(index.searchIndex(['American', 'thriller', 'author', 'Brown'])).toEqual(result);
  });
});