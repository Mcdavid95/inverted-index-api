'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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
      if (isArray.length > 0) {
        if (isArray.some(function (arrayObject) {
          return arrayObject.title === undefined || arrayObject.text === undefined;
        })) {
<<<<<<< HEAD
          throw new Error('malformed file');
        } else {
          return true;
=======
          return 'Incorrect Json format';
>>>>>>> refs/remotes/origin/dev
        }
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
      var _this = this;

      if (this.isJson(fileContent) === true) {
        this.index = {};
        this.fileContent = fileContent;
        this.fileName = fileName;
        var mappedIndex = {};
        fileContent.forEach(function (file) {
          var textFile = file.text;
          var removeSymbols = textFile.replace(/[-.,;:#*!@%&+={}?|_~''\\()]/g, ' ');
          var changeToLowerCase = removeSymbols.toLowerCase();
          var singleWord = changeToLowerCase.split(' ');

          singleWord.forEach(function (word) {
            if (word in mappedIndex) {
              var joinedIndex = mappedIndex[word].concat([fileContent.indexOf(file)]);
              mappedIndex[word] = Array.from(new Set(joinedIndex));
              _this.index[fileName] = mappedIndex;
            }
            if (!(word in mappedIndex)) {
              mappedIndex[word] = [fileContent.indexOf(file)];
            } else if (!(fileContent.indexOf(file) in mappedIndex[word])) {
              _this.index[fileName] = mappedIndex;
            }
          });
        });
        this.mappedIndex = mappedIndex;
        return this.index;
      }
<<<<<<< HEAD
=======
      this.index = null;
      return 'Incorrect Json format';
>>>>>>> refs/remotes/origin/dev
    }
    /**
     * @return {Object} returns index
     * @param {String} fileName of indexed file
     */

  }, {
    key: 'getIndex',
    value: function getIndex(fileName) {
      this.fileName = fileName;
<<<<<<< HEAD
      var index = this.index[fileName];
      return index;
=======
      var mappedIndex = {};
      mappedIndex[fileName] = this.mappedIndex;
      return mappedIndex;
>>>>>>> refs/remotes/origin/dev
    }

    /**
     * @return {Object}returns an Object containing search results
     * @param {String } fileName
     * @param {Array } terms
     */

  }, {
    key: 'searchIndex',
    value: function searchIndex(fileName) {
      var _this2 = this;

      for (var _len = arguments.length, terms = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        terms[_key - 1] = arguments[_key];
      }

      if (terms[0] === undefined) {
        terms = fileName;
      }
      var index = this.index[this.fileName];
      var check = terms.toString().toLowerCase();
      var words = check.split(',');
      var searchWords = {};
      var results = {};
      if (words.length > 1) {
        words.forEach(function (word) {
          if (word in index) {
            results[word] = index[word];
            searchWords[_this2.fileName] = results;
          } else {
            results[word] = ['Term not found'];
            searchWords[_this2.fileName] = results;
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
  }]);

  return InvertedIndex;
}();

exports.default = InvertedIndex;