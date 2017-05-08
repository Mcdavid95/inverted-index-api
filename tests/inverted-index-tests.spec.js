// import jasmine from 'jasmine-node';
import InvertedIndex from '../src/inverted-index';
import books from '../fixtures/books.json';
import invalid from '../fixtures/invalidBook.json';
import fortress from '../fixtures/book1.json';
// import badBooks from '../fixtures/badBooks.json';

describe('Read book data', () => {
  it('should not be empty', () => {
    const index = new InvertedIndex(books);

    expect(index.isJson(books)).toBe(true);
  });

  it('should be a valid json file', () => {
    const index = new InvertedIndex(books);

    expect(index.isJson(books)).toBeTruthy();
  });

  it('should throw error for malformed file', () => {
    const index = new InvertedIndex(invalid);

    expect(index.isJson(invalid)).toEqual('malformed file');
  });
});

describe('Populate Index', () => {
  describe('when a Valid JSON is passed to create index', () => {
    it('should return correct index', () => {
      const index = new InvertedIndex();
      const fileName = 'book1';
      const result = { book1:
      { 1998: [0],
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

      expect(index.createIndex(fileName, fortress)).toEqual(result);
    });

    it('should not create index if file is an invalid json', () => {
      const index = new InvertedIndex();
      const fileName = 'invalid';

      expect(index.createIndex(fileName, invalid)).toEqual('malformed file');
    });
  });
});


describe('Search Index', () => {
  it('should return correct result from index when', () => {
    const index = new InvertedIndex();
    const fileName = 'books';
    const result = { books: { unusual: [0], murder: [0] } };
    index.createIndex(fileName, books);

    expect(index.searchIndex(fileName, 'unusual', 'murder')).toEqual(result);
  });

  it('should be able to handle an array of argumets', () => {
    const index = new InvertedIndex();
    const fileName = 'books';
    index.createIndex(fileName, books);
    const result = { books:
    { unusual: [0],
      murder: [0],
      spy: [1],
      his: [0, 1],
      salander: [0],
      jason: [1],
      bourne: [1],
      vanger: [0] } };

    expect(index.searchIndex(fileName, ['unusual', 'murder', 'spy', 'his', 'Salander', ['jason', 'bourne'], 'Vanger']))
    .toEqual(result);
  });

  it('should handle a varied number of search terms as arguments', () => {
    const index = new InvertedIndex();
    const fileName = 'Digital Fortress';
    index.createIndex(fileName, fortress);
    const result = { 'Digital Fortress': { american: [0], thriller: [0], author: [0], brown: [0] } };

    expect(index.searchIndex(fileName, 'American', 'thriller', 'author', 'Brown')).toEqual(result);
  });

  it('should ensure searchIndex goes through all indexed files if a filename/key is not passed.', () => {
    const index = new InvertedIndex();
    const fileName = 'Digital Fortress';
    index.createIndex(fileName, fortress);
    const result = { 'Digital Fortress': { american: [0], thriller: [0], author: [0], brown: [0] } };

    expect(index.searchIndex(['American', 'thriller', 'author', 'Brown'])).toEqual(result);
  });

  it('should return message: `Term not found` if search term not in index', () => {
    const index = new InvertedIndex();
    const fileName = 'Books';
    index.createIndex(fileName, books);
    const result = { Books:
    { american: ['Term not found'],
      thriller: [1],
      author: ['Term not found'],
      brown: ['Term not found'] } };
    expect(index.searchIndex(['American', 'thriller', 'author', 'Brown'])).toEqual(result);
  });
});
