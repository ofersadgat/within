
const _ = require('lodash');

/*
 * merge will merge the two groups together (and fix the references in the grid to match)
 *
 * @param groupA   The destination group to merge into
 * @param groupB   The src group to merge from
 * @param grid     The grid whose references we should update to the new group
 * @return 
 */
let merge = function(groupA, groupB, grid){
	if (!groupA || !groupB || groupA === groupB || groupA.value !== groupB.value){
		return;
	}
	groupA.count += groupB.count;
	groupA.isConnectedOutside = groupA.isConnectedOutside || groupB.isConnectedOutside;
	groupB.nodes.forEach(function(location) {
		grid[location[0]][location[1]] = groupA;
	});
	groupA.nodes = groupA.nodes.concat(groupB.nodes);
};


/*
 * CalculateContainedWater will return the number of squares which can hold a liquid.
 * It does this by determining which squared are connected and uses that to form groups.
 * Furthermore, while doing so, it marks which groups are connected to the outside. Once
 * the groups have been determined, it will add up the number of nodes which arent connected
 * to the outside and return that value.
 *
 * @param data   An array of array of integers which are either 0 or 1 (0 for hole, 1 for wall). E.g. [[1, 1, 1], [1, 0, 1], [1, 1, 1]]
 * @return The amount of water the container can hold (in the example above it is 1).
 */
let CalculateContainedWater = function(data) {
	//Here we create a grid of group objects. Each spot is initially its own group.
	let grid = data.map(function(row, rowIndex){
		return row.map(function(column, columnIndex){
			return {
				value: column,
				nodes: [[rowIndex, columnIndex]],
				isConnectedOutside: false
			};
		});
	});
	
	//Here we merge neighboring groups into a single group
	for (let rowIndex = 0; rowIndex < grid.length; rowIndex++){
		let row = grid[rowIndex];
		for (let column = 0; column < row.length; column++){
			let group = row[column];
			if (rowIndex === 0 || rowIndex === grid.length - 1 || column === 0 || column === row.length - 1){
				group.isConnectedOutside = true;
			}
			
			merge(group, row[column - 1], grid);
			merge(group, row[column + 1], grid);
			merge(group, grid[rowIndex + 1] && grid[rowIndex + 1][column], grid);
			merge(group, grid[rowIndex - 1] && grid[rowIndex - 1][column], grid);
		}
	}

	//Now that we have the groups, we find the unique ones and add the total of groups which are not connected to the outside
	let uniqueGroups = _.uniq(_.flatten(grid));
	return _.reduce(uniqueGroups, function(current, group) {
		if (!group.isConnectedOutside && group.value === 0){
			return current + group.nodes.length;
		}
		return current;
	}, 0);
};


module.exports = {
	CalculateContainedWater: CalculateContainedWater,
};

