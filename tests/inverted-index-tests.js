const index = require('../src/inverted-index');
const jasmine = require('jasmine-node');

describe('Read book data', () => {
  it('ensures the file content is atually a valid JSON array', () => {
    expect(index.checkFile(JSON.stringify('./fixtures/books')).statusMessage).toBe('Success');
  });

  it('ensures JSON array is not empty', () => {
    expect(index.createIndex('../fixtures/books')).toBe('file is empty');
  });

  it('ensures malformed file returns proper response error', () => {
    expect(index.createIndex('../fixtures/bad.json')).toBe('bad JSON file');
  });
});
describe('Populate index', () => {
  it('should return [0, 1] for "the" in the "book2.json" document', () => {
    expect(index.index['book2.json'].the).toEqual([0, 1]);
  });

  it('should return [1] for "us" in the "book1.json" document', () => {
    expect(index.index['book1.json'].us).toEqual([1]);
  });
});

describe('Search index', () => {
  it('should return { "jason": [1] } for the word "Jason"', () => {
    expect(index.searchIndex('Jason')).toEqual({ jason: [1] });
  });

  it('should return { "set": [0, 1] } for the word "Set"', () => {
    expect(index.searchIndex('Set')).toEqual({ set: [0, 1] });
  });

  it('should return { "understand":[0,1], "from": [1] } for array ["understand","from"]', () => {
    expect(index.searchIndex(['understand', 'from'])).toEqual({ understand:[0,1], from: [1] });
  });

  it('should return toEqual({ "to": [0, 1], "is": [1], "into": [0] }) for "to","is","beginner"', () => {
    expect(index.searchIndex('to', 'is', 'into')).toEqual({ to: [0, 1], is: [1], into: [0] });
  });

  it('should return [-1] for any word not present', () => {
    expect(index.searchIndex('catwalk')).toEqual({ catwalk: [-1] });
  });
});

