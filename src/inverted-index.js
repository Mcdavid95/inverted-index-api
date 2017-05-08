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
    this.document = {};
  }
      /**
       * @return {Error | boolean} returns true or an error message
       * @param {any } file any file
       */
  isJson(file) {
    this.content = file;
    const stringFile = JSON.stringify(file);
    const isArray = JSON.parse(stringFile);
    if (isArray.length > 0) {
      if (isArray.some(arrayObject => arrayObject.title === undefined ||
       arrayObject.text === undefined)) {
        return ('malformed file');
      }
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
    if (this.isJson(fileContent) === true) {
      this.index = {};
      this.fileContent = fileContent;
      this.fileName = fileName;
      const mappedIndex = {};
      fileContent.forEach((file) => {
        const textFile = file.text;
        const removeSymbols = textFile
        .replace(/[-.,;:#*!@%&+={}?|_~''\\()]/g, ' ').toLowerCase();
        const singleWord = removeSymbols.split(' ');

        singleWord.forEach((word) => {
          if (word in mappedIndex) {
            const joinedIndex = (mappedIndex[word].concat([fileContent.indexOf(file)]));
            mappedIndex[word] = Array.from(new Set(joinedIndex));
            this.index[fileName] = mappedIndex;
          }
          if (!(word in mappedIndex)) {
            mappedIndex[word] = [fileContent.indexOf(file)];
          } else if (!(fileContent.indexOf(file) in mappedIndex[word])) {
            this.index[fileName] = mappedIndex;
          }
        });
      });
      const indices = this.index;
      return indices;
    }
    this.index = null;
    return 'malformed file';
  }
      /**
       * @return {Object} returns index
       * @param {String} fileName of indexed file
       */
 /* getIndex(fileName) {
    this.fileName = fileName;
    const index = this.index[fileName];
    return index;
  }*/

  /**
   * @return {Object}returns an Object containing search results
   * @param {String } fileName
   * @param {Array } terms
   */
  searchIndex(fileName, ...terms) {
    if (terms[0] === undefined) {
      terms = fileName;
    }
    const index = this.index[this.fileName];
    const check = terms.toString().toLowerCase();
    const words = check.split(',');
    const searchWords = {};
    const results = {};
    if (words.length > 1) {
      words.forEach((word) => {
        if (word in index) {
          results[word] = index[word];
          searchWords[this.fileName] = results;
        } else {
          results[word] = ['Term not found'];
          searchWords[this.fileName] = results;
        }
      });
    } else if (words in index) {
      results[words] = index[words];
      searchWords[this.fileName] = results;
    } else {
      results[words] = ['Term not found'];
      searchWords[this.fileName] = results;
    }
    return searchWords;
  }
}
export default InvertedIndex;
