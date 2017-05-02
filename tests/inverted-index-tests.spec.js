const index = require('../src/inverted-index.js');
const jasmine = require('jasmine');

describe('Read book data', () => {
  it('ensures the file content is atually a valid JSON array', () => {
    expect(index.checkFile(JSON.stringify('./fixtures/books')).statusMessage).toBe('Success');
  });

  it('ensures JSON array is not empty', () => {
    expect(index.createIndex('../fixtures/books')).toBe('file is empty');
  })

