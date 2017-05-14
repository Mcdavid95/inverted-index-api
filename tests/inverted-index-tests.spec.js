/* eslint no-undef: 0 */
import supertest from 'supertest';
import InvertedIndex from '../src/inverted-index';
import books from '../fixtures/books.json';
import invalid from '../fixtures/invalidBook.json';
import fortress from '../fixtures/book1.json';
import server from '../routes/app';

const api = supertest(server);


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

    expect(index.isJson(invalid)).toEqual('Incorrect Json format');
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
        martins: [0],
        press: [0] } };

      expect(index.createIndex(fileName, fortress)).toEqual(result);
    });

    it('should not create index if file is an invalid json', () => {
      const index = new InvertedIndex();
      const fileName = 'invalid';

      expect(index.createIndex(fileName, invalid)).toEqual('Incorrect Json format');
    });

    it('should check if index has been created', () => {
      const index = new InvertedIndex();
      const fileName = 'Fortress';

      expect(index.createIndex(fileName, fortress)).toEqual(index.getIndex(fileName));
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

  it('should ensure searchIndex goes through all indexed files if an array is passed without a filename/key', () => {
    const index = new InvertedIndex();
    const fileName = 'Digital Fortress';
    index.createIndex(fileName, fortress);
    const result = { 'Digital Fortress': { american: [0], thriller: [0], author: [0], brown: [0] } };

    expect(index.searchIndex(['American', 'thriller', 'author', 'Brown'])).toEqual(result);
  });

  it('shoul ensure SearchIndex goes through all indexed files if an string(s) is passed without fileName or key',
  () => {
    const index = new InvertedIndex();
    const fileName = 'Digital Fortress';
    index.createIndex(fileName, fortress);
    const result = { 'Digital Fortress': { american: [0] } };
    expect(index.searchIndex('american')).toEqual(result);
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


describe('Test Inverted-Index-Api using supertest', (done) => {
  describe('should create index through the the api/create route', (done) => {
    it('should return correct status code when creating an index', (done) => {
      api.post('/api/create')
          .attach('books', './fixtures/books.json')
          .end((err, res) => {
            expect(res.status).toEqual(200);
            done(err);
          });
    });

    it('should return error when no parameter is passed', (done) => {
      api.post('/api/create')
          .attach()
          .end((err, res) => {
            expect(res.text).toEqual('Please pass in valid book filetype and key to create index');
            done(err);
          });
    });

    it('should return correct index for create index', (done) => {
      api.post('/api/create')
          .attach('books', './fixtures/book1.json')
          .end((err, res) => {
            const result = { 'book1.json':
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
              martins: [0],
              press: [0] } };
            expect(JSON.parse(res.text)).toEqual(result);
            done(err);
          });
    });
  });

  describe('Test to check functionality of the /api/search route: ', (done) => {
    it('should return the correct status code for `ok` access', (done) => {
      api.post('/api/create')
          .attach('books', './fixtures/books.json')
          .end(() => {
            api.post('/api/search')
            .send({
              fileName: 'books.json',
              terms: ['bourne', 'identity']
            })
            .end((err, res) => {
              expect(res.status).toEqual(200);
              done(err);
            });
          });
    });

    it('should return error message if no parameter is supplied', (done) => {
      const result = JSON.stringify('Please supply a fileName and search-term(s) or only search-term(s)');
      api.post('/api/create')
          .attach('books', './fixtures/book1.json')
          .end(() => {
            api.post('/api/search')
            .send({
            })
            .end((err, res) => {
              expect(res.text).toEqual(result);
              done(err);
            });
          });
    });

    it('it should return `term not found if search term not in index`', (done) => {
      const result = { 'book1.json': { fortnuress: ['Term not found'] } };
      api.post('/api/create')
          .attach('books', './fixtures/book1.json')
          .end(() => {
            api.post('/api/search')
            .send({
              fileName: 'book1.json',
              terms: 'fortnuress'
            })
            .end((err, res) => {
              expect(JSON.parse(res.text)).toEqual(result);
              done(err);
            });
          });
    });
  });
  server.close();
});

