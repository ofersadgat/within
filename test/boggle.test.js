
const boggle = require('../src/boggle');
const prng = require('../src/prng');
const chai = require('chai');
const expect = chai.expect;
const fs = require('fs');
const path = require('path');
const currentDirectory = __dirname;

let generate = false;

describe('Tests for Boggle', function() {
  it('should export the needed functions', function() {
    expect(boggle.solve).to.exist;
    expect(boggle.generate).to.exist;
  });

  let testDirectory = path.resolve(currentDirectory, 'fixtures', 'boggle');
  fs.readdirSync(testDirectory).forEach(function(fileName){
    if (fileName.endsWith('.expected.json')){
      return;
    }
    let expectedFileName = fileName.replace('.txt', '.expected.json');
    let seed = parseInt(fileName.replace('.txt', ''));
    let board;

    let testCase = boggle.deserializeBoard(fs.readFileSync(path.resolve(testDirectory, fileName), 'utf8'));
    it('expect the seed ' + seed + ' to result in the expected board', function() {
      prng.seed(seed);
      board = boggle.generate();

      if (generate){
        fs.writeFileSync(path.resolve(testDirectory, fileName), boggle.serializeBoard(board), 'utf8');
      }

      expect(testCase).to.deep.equal(board);
    });

    let expected = fs.readFileSync(path.resolve(testDirectory, expectedFileName), 'utf8');
    expected = expected && JSON.parse(expected);
    it('expect the solution to the board with seed ' + seed + ' to be the expected solution', function() {
      if (generate){
        fs.writeFileSync(path.resolve(testDirectory, expectedFileName), JSON.stringify(boggle.solve(board)), 'utf8');
      }
      expect(boggle.solve(board)).to.deep.equal(expected);
    });    
  });
});

