
const fs = require('fs');
const trie = require('trie-prefix-tree');
const wordListPath = require('word-list');

const words = fs.readFileSync(wordListPath, 'utf8').split('\n');
const dictionary = trie(words);
const prng = require('./prng');

// taken from the 6x6 version https://en.wikipedia.org/wiki/Boggle
const scores = [
  0, 0, 0, 1, 2,
  3, 5, 11, 13, 15,
  17, 19, 21, 23, 25,
  27, 29, 31, 33, 35,
  37, 39, 41, 43, 45, 47,
];


/*
 * pointEquals will compare two points
 *
 * @param pointA An array of x, and y values. E.g. [1, 2]
 * @param pointB An array of x, and y values. E.g. [2, 1]
 * @return A boolean of whether or not the points are equal
 */
const pointEquals = function pointEquals(pointA, pointB) {
  return (pointA[0] === pointB[0]) && (pointA[1] === pointB[1]);
};

/*
 * pointValid will check whether or not a point can exist (i.e. it doesnt go outside the bounds of
 * the board)
 *
 * @param point the point to check. An array of x and y values.
 * @return A boolean of whether or not the point is in the board
 */
const pointValid = function pointValid(point) {
  return point[0] >= 0 && point[0] < 5 && point[1] >= 0 && point[1] < 5;
};

/*
 * pointInList will take a point and a list of points and return whether the point is in the list
 *
 * @param point the point to check. An array of x and y values.
 * @param points the list of points to check E.g. [[1, 2], [1, 3]].
 * @return A boolean of whether or not the point is in the list
 */
const pointInList = function pointInList(point, list) {
  const result = list.filter(listPoint => pointEquals(listPoint, point)).length > 0;
  return result;
};

/*
 * getWordFromPoints will take the points used to form a word and the board and return the word
 * corresponding to the points
 *
 * @param board the board to solve (an array of array of characters)
 * @param points the points on the board which have already been chosen. An array of points.
 *                E.g. [[1, 2], [1, 3]].
 * @return The corresponding word (or fragment thereof).
 */
const getWordFromPoints = function getWordFromPoints(board, points) {
  let result = '';
  points.forEach((point) => {
    result += board[point[0]][point[1]];
  });
  return result;
};

/*
 * score will take the points used to form a word and the board and return the score for the points
 *
 * @param board the board to solve (an array of array of characters)
 * @param points the points on the board which have already been chosen. An array of points.
 *                E.g. [[1, 2], [1, 3]].
 * @return The resulting score.
 */

const score = function score(board, points) {
  let currentScore = scores[points.length];
  let multiplier = 1;
  points.forEach((point) => {
    if (pointInList(point, [[0, 0], [0, 4], [4, 0], [4, 4]])) {
      currentScore += 3;
    } else if (pointInList(point, [[1, 1], [1, 3], [3, 1], [3, 3]])) {
      currentScore += 2;
    } else if (point[0] === 2 && point[1] === 2) {
      multiplier = 2;
    }
  });
  return currentScore * multiplier;
};

/*
 * solveGivenPoints will generate a solution to the given board given the points provided.
 * The solution contains the word and score of the word.
 *
 * @param board the board to solve (an array of array of characters)
 * @param points the points on the board which have already been chosen. An array of points.
 *                 E.g. [[1, 2], [1, 3]].
 * @return An object with the word parameter and score parameters.
 */
const solveGivenPoints = function solveGivenPoints(board, points) {
  const word = getWordFromPoints(board, points);
  const lastPoint = points[points.length - 1];
  let bestSolution = null;
  if (dictionary.hasWord(word)) {
    bestSolution = { word, score: score(board, points) };
  }
  if (dictionary.isPrefix(word)) {
    const up = [lastPoint[0] - 1, lastPoint[1]];
    const down = [lastPoint[0] + 1, lastPoint[1]];
    const left = [lastPoint[0], lastPoint[1] - 1];
    const right = [lastPoint[0], lastPoint[1] + 1];
    const cardinal = [up, down, left, right];

    const upLeft = [lastPoint[0] - 1, lastPoint[1] - 1];
    const upRight = [lastPoint[0] - 1, lastPoint[1] + 1];
    const downLeft = [lastPoint[0] + 1, lastPoint[1] - 1];
    const downRight = [lastPoint[0] + 1, lastPoint[1] + 1];
    const diagonal = [upLeft, upRight, downLeft, downRight];

    // Not sure about rules for when to use cardinal vs diagonal, so Ill leave a
    // place here to insert that, but currently impose no restriction
    const available = []
      .concat(cardinal)
      .concat(diagonal)
      .filter(pointValid)
      .filter(point => !pointInList(point, points));

    const solutions = available.map(newPoint => solveGivenPoints(board, points.concat([newPoint])));
    solutions.forEach((solution) => {
      if (!solution) {
        return;
      }
      if (bestSolution === null || solution.score > bestSolution.score) {
        bestSolution = solution;
      }
    });
  }
  return bestSolution;
};

/*
 * solve will generate a solution to the given board. The solution contains the word
 * and score of the word.
 *
 * @param board the board to solve (an array of array of characters)
 * @return An object with the word parameter and score parameters.
 */
const solve = function solve(board) {
  // board: [['a', 'b', 'c'],['d', 'e', 'f'],['g', 'h', 'i']] (but 5x5 not 3x3)
  let bestSolution = null;
  for (let i = 0; i < board.length; i += 1) {
    for (let j = 0; j < board.length; j += 1) {
      const point = [i, j];
      const solution = solveGivenPoints(board, [point]);
      if (bestSolution === null || (solution && solution.score > bestSolution.score)) {
        bestSolution = solution;
      }
    }
  }
  return bestSolution;
};


// from https://boardgames.stackexchange.com/questions/29264/boggle-what-is-the-dice-configuration-for-boggle-in-various-languages
const dice = [
  ['q', 'b', 'z', 'j', 'x', 'k'],
  ['t', 'o', 'u', 'o', 't', 'o'],
  ['o', 'v', 'w', 'r', 'g', 'r'],
  ['a', 'a', 'a', 'f', 's', 'r'],
  ['a', 'u', 'm', 'e', 'e', 'g'],

  ['h', 'h', 'l', 'r', 'd', 'o'],
  ['n', 'h', 'd', 't', 'h', 'o'],
  ['l', 'h', 'n', 'r', 'o', 'd'],
  ['a', 'd', 'a', 'i', 's', 'r'],
  ['y', 'i', 'f', 'a', 's', 'r'],

  ['t', 'e', 'l', 'p', 'c', 'i'],
  ['s', 's', 'n', 's', 'e', 'u'],
  ['r', 'i', 'y', 'p', 'r', 'h'],
  ['d', 'o', 'r', 'd', 'l', 'n'],
  ['c', 'c', 'w', 'n', 's', 't'],

  ['t', 't', 'o', 't', 'e', 'm'],
  ['s', 'c', 't', 'i', 'e', 'p'],
  ['e', 'a', 'n', 'd', 'n', 'n'],
  ['m', 'n', 'n', 'e', 'a', 'g'],
  ['u', 'o', 't', 'o', 'w', 'n'],

  ['a', 'e', 'a', 'e', 'e', 'e'],
  ['y', 'i', 'f', 'p', 's', 'r'],
  ['e', 'e', 'e', 'e', 'm', 'a'],
  ['i', 't', 'i', 't', 'i', 'e'],
  ['e', 't', 'i', 'l', 'i', 'c'],
];

/*
 * generate will generate a random board.
 *
 * @return An array of array of characters representing the board
 */

const generate = function generate() {
  // determine the size of the board by assuming that it is a square and using the length of the
  //  dice to determine the length of a side
  const size = Math.sqrt(dice.length);
  const result = [];
  dice.forEach((die, i) => {
    // determine position of die on board
    const row = Math.floor(i / size);
    const index = i % size;

    // determine random letter of die
    const letterIndex = Math.floor(prng.random() * die.length);
    const letter = die[letterIndex];

    // assign to row
    result[row] = result[row] || [];
    result[row][index] = letter;
  });
  return result;
};


/*
 * serializeBoard will take a board and serialize it to each row split by '\n'
 * and letters concatenated.
 *
 * @param board   The array of array of characters
 * @return A string with each row separated by '\n'
 */

const serializeBoard = function serializeBoard(board) {
  let result = '';
  board.forEach((row) => {
    row.forEach((letter) => {
      result += letter;
    });
    result = `${result}\n`;
  });
  return result.trim();
};


/*
 * deserializeBoard will take a serialized board and convert it into the array of arrays that solve
 * expects
 *
 * @param board   A string with \n in between rows and all the letters concatenated.
 * @return An array of array of characters which solve expects as an input
 */

const deserializeBoard = function deserializeBoard(board) {
  if (!board) {
    return null;
  }
  const result = [];
  board = board.split('\n');
  for (let i = 0; i < board.length; i += 1) {
    const row = board[i];
    result[i] = [];
    for (let j = 0; j < row.length; j += 1) {
      result[i][j] = row[j];
    }
  }
  return result;
};

module.exports = {
  solve,
  serializeBoard,
  deserializeBoard,
  score,
  generate,
};
