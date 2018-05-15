
// rng from https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
let mW = 123456789;
let mZ = 987654321;
const mask = 0xffffffff;

// Takes any integer
const seed = function seed(i) {
  mW = i;
  mZ = 987654321;
};

// Returns number between 0 (inclusive) and 1.0 (exclusive),
// just like Math.random().
const random = function random() {
  mZ = ((36969 * (mZ & 65535)) + (mZ >> 16)) & mask;
  mW = ((18000 * (mW & 65535)) + (mW >> 16)) & mask;
  let result = ((mZ << 16) + mW) & mask;
  result /= 4294967296;
  return result + 0.5;
};

module.exports = {
  seed,
  random,
};
