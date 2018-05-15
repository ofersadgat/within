
const wallclock = require('../src/wallclock');
const chai = require('chai');
const expect = chai.expect;

describe('Tests for Wallclock', function() {
  it('should be exported', function() {
    expect(wallclock.getAngle).to.exist;
  });

  it('should produce expected results', function() {
    const testCases = {
      //cover corner cases with 12
      '12:00': 0,
      '12:15': 82.5,
      '12:30': 165,
      '12:45': 247.5,

      //cover corner cases with 11
      '11:00': 330,
      '11:15': 247.5,
      '11:30': 165,
      '11:45': 247.5,      
    };

    Object.keys(testCases).forEach(function(time){
      expect(wallclock.getAngle(time)).to.equal(testCases[time]);
    });
  });


});
