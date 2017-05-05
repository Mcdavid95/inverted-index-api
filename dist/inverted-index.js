'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @class InvertedIndex
 */
var InvertedIndex = function () {
  /**
   * @constructor
   */
  function InvertedIndex() {
    _classCallCheck(this, InvertedIndex);

    this.mappedIndex = {};
    this.content = '';
    this.documents = {};
  }
  /**
   * @return {Error | boolean} returns true or an error message
   * @param {any } file any file
   */


  _createClass(InvertedIndex, [{
    key: 'isJson',
    value: function isJson(file) {
      this.content = file;
      var stringFile = JSON.stringify(file);
      var isArray = JSON.parse(stringFile);
      if (isArray.length > 0 && isArray.some(function (arrayObject) {
        return arrayObject.title === undefined && arrayObject.text === undefined;
      })) {
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

  }, {
    key: 'createIndex',
    value: function createIndex(fileName, fileContent) {
      if (this.isJson(fileName) === true && fileName.length > 0) {
        fileContent = fileName;
        this.content = fileContent;
        var mappedIndex = {};
        fileContent.forEach(function (file) {
          var doc = file.text;
          var removeSymbols = doc.replace(/[-.,;:#*!@%&+={}?|_~\\()]/g, ' ');
          var changeToLowerCase = removeSymbols.toLowerCase();
          var singleWord = changeToLowerCase.split(' ');

          singleWord.forEach(function (word) {
            if (word in mappedIndex) {
              var joinedIndex = mappedIndex[word].concat([fileContent.indexOf(file)]);
              mappedIndex[word] = Array.from(new Set(joinedIndex));
            }
            if (!(word in mappedIndex)) {
              mappedIndex[word] = [fileContent.indexOf(file)];
            } else if (!singleWord.indexOf(file)) {
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

  }, {
    key: 'getIndex',
    value: function getIndex(filename) {
      return this.documents[filename];
    }

    /**
     * @return {Object}returns an Object containing search results
     * @param {Objects } index
     * @param {String } filename
     * @param {Array } terms
     */

  }, {
    key: 'searchIndex',
    value: function searchIndex(index, filename) {
      index = this.documents;

      for (var _len = arguments.length, terms = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        terms[_key - 2] = arguments[_key];
      }

      var words = terms.toString().split(',');
      var searchWords = {};
      var results = {};
      if (words.length > 1) {
        words.forEach(function (word) {
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

  }]);

  return InvertedIndex;
}();

exports.InvertedIndex = InvertedIndex;