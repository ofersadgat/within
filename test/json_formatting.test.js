
const json_formatting = require('../src/json_formatting');
const chai = require('chai');
const expect = chai.expect;
const fs = require('fs');
const path = require('path');
const currentDirectory = __dirname;

describe('Tests for json_formatting', function() {
  it('should export visualize_data', function() {
    expect(json_formatting.visualize_data).to.exist;
    expect(json_formatting.stringify_data).to.exist;
  });

  let testDirectory = path.resolve(currentDirectory, 'fixtures', 'json_formatting');
  fs.readdirSync(testDirectory).forEach(function(fileName){
    if (fileName.endsWith('.expected.txt')){
      return;
    }
    let expectedFileName = fileName.replace('.json', '.expected.txt');
    let testCase = JSON.parse(fs.readFileSync(path.resolve(testDirectory, fileName)));
    let expected = fs.readFileSync(path.resolve(testDirectory, expectedFileName));
    it(fileName, function() {
      expect(json_formatting.stringify_data(testCase)).to.equal(expected);
    });    
  });
});

