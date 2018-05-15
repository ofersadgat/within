
const chessboard = require('../src/chessboard');
const chai = require('chai');
const expect = chai.expect;
const fs = require('fs');
const path = require('path');
const currentDirectory = __dirname;

describe('Tests for chessboard', function() {
  it('should export CalculateContainedWater', function() {
    expect(chessboard.CalculateContainedWater).to.exist;
  });

  let testDirectory = path.resolve(currentDirectory, 'fixtures', 'chessboard');
  fs.readdirSync(testDirectory).forEach(function(fileName){
    if (fileName.endsWith('.expected.txt')){
      return;
    }
    let expectedFileName = fileName.replace('.txt', '.expected.txt');
    let testCase = fs.readFileSync(path.resolve(testDirectory, fileName), 'utf8');
    testCase = testCase.split('\n').map(function(row) {
      let squares = [];
      for (let i = 0; i < row.length; i++){
        squares.push(row[i] - '0');
      }
      return squares;
    });
    let expected = parseInt(fs.readFileSync(path.resolve(testDirectory, expectedFileName), 'utf8'));
    it(fileName, function() {
      expect(chessboard.CalculateContainedWater(testCase)).to.equal(expected);
    });    
  });
});

