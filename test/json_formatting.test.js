
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

  let valueTestCases = {
    'True': true,
    'tRuE': true,
    'true': true,
    'trueb': true,
    'False': false,
    'fAlSe': false,
    'false': false,
    'falsea': false,
    '123': 123,
    '123.5': 123.5,
    '123.5a': 123.5,
  };

  Object.keys(valueTestCases).forEach(function(input){
    it('parse_value: ' + input + ' should equal ' + JSON.stringify(valueTestCases[input]), function() {
      expect(json_formatting.parse_data(input).result).to.equal(valueTestCases[input]);
    });
  });

  let stringTestCases = {
    '"test"': 'test',
    '"this is a"test': 'this is a',
  };

  Object.keys(stringTestCases).forEach(function(input){
    it('parse_string: ' + input + ' should equal ' + JSON.stringify(stringTestCases[input]), function() {
      expect(json_formatting.parse_string(input).result).to.equal(stringTestCases[input]);
    });
  });

  let arrayTestCases = {
    '[True,1,"test",4]': [true, 1, 'test', 4],
    '[]': [],
    '[,]': [],
  };

  Object.keys(arrayTestCases).forEach(function(input){
    it('parse_array: ' + input + ' should equal ' + JSON.stringify(arrayTestCases[input]), function() {
      expect(json_formatting.parse_array(input).result).to.deep.equal(arrayTestCases[input]);
    });
  });

  let objectTestCases = {
    '{"1": 2, "test": "True","truthy": True}': {1:2, test: 'True', truthy: true},
    '{"foo":{"bar":{,},"baz":1},}': {foo:{bar:{},baz:1}},
    '{,}': {},
  };

  Object.keys(objectTestCases).forEach(function(input){
    it('parse_object: ' + input + ' should equal ' + JSON.stringify(objectTestCases[input]), function() {
      expect(json_formatting.parse_object(input).result).to.deep.equal(objectTestCases[input]);
    });
  });

  let dataTestCases = Object.assign({}, arrayTestCases, stringTestCases, objectTestCases);
  Object.keys(dataTestCases).forEach(function(input){
    it('parse_data: ' + input + ' should equal ' + JSON.stringify(dataTestCases[input]), function() {
      expect(json_formatting.parse_data(input).result).to.deep.equal(dataTestCases[input]);
    });
  });

  let testDirectory = path.resolve(currentDirectory, 'fixtures', 'json_formatting');
  fs.readdirSync(testDirectory).forEach(function(fileName){
    if (fileName.endsWith('.expected.txt')){
      return;
    }
    let expectedFileName = fileName.replace('.json', '.expected.txt');
    let testCase = json_formatting.parse_data(fs.readFileSync(path.resolve(testDirectory, fileName), 'utf8')).result;
    let expected = fs.readFileSync(path.resolve(testDirectory, expectedFileName), 'utf8').split('\r\n').join('\n');
    it(fileName, function() {
      expect(json_formatting.stringify_data(testCase)).to.equal(expected);
    });    
  });


});

