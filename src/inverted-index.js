/**
 * @class InvertedIndex
 */
class InvertedIndex {
/**
 * @constructor
 */
  constructor() {
    this.mappedIndex = {};
    this.content = '';
    this.documents = {};
  }
/**
 * @return {Error | boolean} returns true or an error message
 * @param {any } file any file
 */
  isJson(file) {
    this.content = file;
    const stringFile = JSON.stringify(file);
    const isArray = JSON.parse(stringFile);
    if (isArray.length > 0 && isArray.some(arrayObject => arrayObject.title === undefined && arrayObject.text === undefined)) {
      throw new Error('malformed file');
    } else {
      return true;
    }
  }

 /**
   *@description {takes in a file and returns an object containing each word and index(ces)}
   * @param {String }fileName of file
   * @param {Object}fileContent content of file to be indexed
   * @return {Object}indexed filename and index(indicies)
   */
  createIndex(fileName, fileContent) {
    if (this.isJson(fileName) === true && fileName.length > 0) {
      fileContent = fileName;
      this.content = fileContent;
      const mappedIndex = {};
      fileContent.forEach((file) => {
        const doc = file.text;
        const removeSymbols = doc.replace(/[-.,;:#*!@%&+={}?|_~\\()]/g, ' ');
        const changeToLowerCase = removeSymbols.toLowerCase();
        const singleWord = changeToLowerCase.split(' ');

        singleWord.forEach((word) => {
          if (word in mappedIndex) {
            const joinedIndex = (mappedIndex[word].concat([fileContent.indexOf(file)]));
            mappedIndex[word] = Array.from(new Set(joinedIndex));
          }
          if (!(word in mappedIndex)) {
            mappedIndex[word] = [fileContent.indexOf(file)];
          } else if (!(singleWord.indexOf(file))) {
            mappedIndex[word] = fileContent.indexOf(file, mappedIndex[word] + 1);
          }
        });
      });
      this.documents = mappedIndex;
      return mappedIndex;
    } else {
      this.documents = null;
      return 'Invalid file or Empty file';
    }
  }
  /**
   *@returns { object} created index
   * @param {String } filename
   */
  getIndex(filename) {
    return this.documents[filename];
  }

  /**
   * @return {Object}returns an Object containing search results
   * @param {Objects } index
   * @param {String } filename
   * @param {Array } terms
   */
  searchIndex(index, filename, ...terms) {
    index = this.documents;
    const words = terms.toString().split(',');
    const searchWords = {};
    const results = {};
    if (words.length > 1) {
      words.forEach((word) => {
        if (word in index) {
          results[word] = index[word];
          searchWords[filename] = results;
        } else {
          results[word] = ['Term not found'];
          searchWords[filename] = results;
        }
      });
    } else if (words in index) {
      results[words] = index[words];
      searchWords[filename] = results;
    } else {
      results[words] = ['Term not found'];
      searchWords[filename] = results;
    }
    return searchWords;
  }
  /**
   * @return {boolean } returns true or false values.
   * @param {Object } file
   */
}
exports.InvertedIndex = InvertedIndex;
