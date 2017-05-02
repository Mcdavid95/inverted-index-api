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
  }

  /**
   *
   * @param {string}filename of file
   * @param {Object}fileContent content of file to be indexed
   * @return {Object}indexed filename and index(indicies)
   */
  createIndex(fileContent, filename) {
    this.content = fileContent;
    const mappedIndex = {};
    fileContent.forEach((file) => {
      const mergeFile = file.text;
      const removeSymbols = mergeFile.replace(/[-.,;:#*!@%&+={}?|_~\\()]/g, ' ');
      const changeToLowerCase = removeSymbols.toLowerCase();
      const singleWord = changeToLowerCase.split(' ');

      singleWord.forEach((word) => {
        if (word in mappedIndex){
          mappedIndex[word] = Array.from(new Set(mappedIndex[word].concat([fileContent.indexOf(file)])));
        }
       if (!(word in mappedIndex)) {
          mappedIndex[word] = [fileContent.indexOf(file)];
        
     } else if (!(singleWord.indexOf(file))) {
       mappedIndex[word] = fileContent.indexOf(file, mappedIndex[word] + 1)
       

             }
      });
    });
    this.mappedIndex = mappedIndex;
    return mappedIndex;
  }
}