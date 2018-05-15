
const fs = require('fs');
const trie = require('trie-prefix-tree');
const wordListPath = require('word-list');
const words = fs.readFileSync(wordListPath, 'utf8').split('\n');
const dictionary = trie(words);
const prng = require('./prng');

//taken from the 6x6 version https://en.wikipedia.org/wiki/Boggle
var scores = [
	0, 0, 0, 1, 2, 
	3, 5, 11, 13, 15,
	17, 19, 21, 23, 25,
	27, 29, 31, 33, 35,
	37, 39, 41, 43, 45, 47
];


/*
 * pointEquals will compare two points
 *
 * @param pointA An array of x, and y values. E.g. [1, 2]
 * @param pointB An array of x, and y values. E.g. [2, 1]
 * @return A boolean of whether or not the points are equal
 */
var pointEquals = function(pointA, pointB){
	return (pointA[0] === pointB[0]) && (pointA[1] === pointB[1]);
};

/*
 * pointValid will check whether or not a point can exist (i.e. it doesnt go outside the bounds of the board)
 *
 * @param point the point to check. An array of x and y values.
 * @return A boolean of whether or not the point is in the board
 */
var pointValid = function(point){
	return point[0] >= 0 && point[0] < 5 && point[1] >= 0 && point[1] < 5;
};

/*
 * pointInList will take a point and a list of points and return whether the point is in the list
 *
 * @param point the point to check. An array of x and y values.
 * @param points the list of points to check E.g. [[1, 2], [1, 3]].
 * @return A boolean of whether or not the point is in the list
 */
var pointInList = function(point, list){
	let result = list.filter(function(listPoint){
		return pointEquals(listPoint, point);
	}).length > 0;
	return result;
};

/*
 * getWordFromPoints will take the points used to form a word and the board and return the word corresponding to the points
 *
 * @param board the board to solve (an array of array of characters)
 * @param points the points on the board which have already been chosen. An array of points. E.g. [[1, 2], [1, 3]].
 * @return The corresponding word (or fragment thereof).
 */
var getWordFromPoints = function(board, points){
	let result = '';
	points.forEach(function(point) {
		result = result + board[point[0]][point[1]];
	});
	return result;
};

/*
 * score will take the points used to form a word and the board and return the score for the points
 *
 * @param board the board to solve (an array of array of characters)
 * @param points the points on the board which have already been chosen. An array of points. E.g. [[1, 2], [1, 3]].
 * @return The resulting score.
 */

var score = function(board, points){
	let score = scores[points.length];
	let multiplier = 1;
	points.forEach(function(point){
		if (pointInList(point, [[0,0],[0,4],[4,0],[4,4]])){
			score = score + 3;
		} else if (pointInList(point, [[1,1],[1,3],[3,1],[3,3]])){
			score = score + 2;
		} else if (point[0] === 2 && point[1] === 2){
			multiplier = 2;
		}
	});
	return score * multiplier;
};

/*
 * solveGivenPoints will generate a solution to the given board given the points provided. The solution contains the word and score of the word.
 *
 * @param board the board to solve (an array of array of characters)
 * @param points the points on the board which have already been chosen. An array of points. E.g. [[1, 2], [1, 3]].
 * @return An object with the word parameter and score parameters.
 */
var solveGivenPoints = function(board, points){
	let word = getWordFromPoints(board, points);
	let lastPoint = points[points.length - 1];
	let bestSolution = null;
	if (dictionary.hasWord(word)){
		bestSolution = {word: word, score: score(board, points)};
	}
	if (dictionary.isPrefix(word)){
		let up = [lastPoint[0] - 1, lastPoint[1]];
		let down = [lastPoint[0] + 1, lastPoint[1]];
		let left = [lastPoint[0], lastPoint[1] - 1];
		let right = [lastPoint[0], lastPoint[1] + 1];
		let cardinal = [up, down, left, right];

		let up_left = [lastPoint[0] - 1, lastPoint[1] - 1];
		let up_right = [lastPoint[0] - 1, lastPoint[1] + 1];
		let down_left = [lastPoint[0] + 1, lastPoint[1] - 1];
		let down_right = [lastPoint[0] + 1, lastPoint[1] + 1];
		let diagonal = [up_left, up_right, down_left, down_right];
		
		//Not sure about rules for when to use cardinal vs diagonal, so Ill leave a place here to insert that, but currently impose no restriction
		let available = [].concat(cardinal).concat(diagonal).filter(pointValid).filter(function(point) {
			return !pointInList(point, points);
		});
		
		let solutions = available.map(function(newPoint){
			return solveGivenPoints(board, points.concat([newPoint]));
		});
		solutions.forEach(function(solution) {
			if (!solution){
				return;
			}
			if (bestSolution === null || solution.score > bestSolution.score){
				bestSolution = solution;
			}
		});
	}
	return bestSolution;
};

/*
 * solve will generate a solution to the given board. The solution contains the word and score of the word.
 *
 * @param board the board to solve (an array of array of characters)
 * @return An object with the word parameter and score parameters.
 */
var solve = function(board){
	//board: [['a', 'b', 'c'],['d', 'e', 'f'],['g', 'h', 'i']] (but 5x5 not 3x3)
	let bestSolution = null;
	for (let i = 0; i < board.length; i++){
		for (let j = 0; j < board.length; j++){
			let point = [i, j];
			let solution = solveGivenPoints(board, [point]);
			if (bestSolution === null || (solution && solution.score > bestSolution.score)){
				bestSolution = solution;
			}
		}
	}
	return bestSolution;
};


//from https://boardgames.stackexchange.com/questions/29264/boggle-what-is-the-dice-configuration-for-boggle-in-various-languages
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

var generate = function() {
	//determine the size of the board by assuming that it is a square and using the length of the dice to determine the length of a side
	let size = Math.sqrt(dice.length);
	let result = [];
	dice.forEach(function(die, i) {
		//determine position of die on board
		let row = Math.floor(i / size);
		let index = i % size;

		//determine random letter of die
		let letterIndex = Math.floor(prng.random() * die.length);
		let letter = die[letterIndex];

		//assign to row
		result[row] = result[row] || [];
		result[row][index] = letter;
	});
	return result;
};


/*
 * serializeBoard will take a board and serialize it to each row split by '\n' and letters concatenated.
 *
 * @param board   The array of array of characters
 * @return A string with each row separated by '\n'
 */

var serializeBoard = function(board) {
	let result = '';
	board.forEach(function(row) {
		row.forEach(function(letter) {
			result = result + letter;
		});
		result = result + '\n';
	});
	return result.trim();
};


/*
 * deserializeBoard will take a serialized board and convert it into the array of arrays that solve expects
 *
 * @param board   A string with \n in between rows and all the letters concatenated.
 * @return An array of array of characters which solve expects as an input
 */

var deserializeBoard = function(board) {
	if (!board){
		return null;
	}
	let result = [];
	board = board.split('\n');
	for (let i = 0; i < board.length; i++){
		let row = board[i];
		result[i] = [];
		for (let j = 0; j < row.length; j++){
			result[i][j] = row[j];
		}
	}
	return result;
};

module.exports = {
	solve: solve,
	serializeBoard: serializeBoard,
	deserializeBoard: deserializeBoard,
	score: score,
	generate: generate,
};
