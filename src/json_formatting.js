

let visualize_data = function( data ){
	let parsed = JSON.parse(data);
	console.log(stringify_data(parsed));
}

let stringify_data = function( data ){	
	if (Array.isArray(data)){
		let result = '\n[\n';
		data.forEach(function(item) {
			result = result + stringify_data(item);
		});
		return result + ']\n';
	} else if (typeof data === 'object'){
		let result = '';
		Object.keys(parsed).sort().forEach(function(key){
			result = result + `"${key}": ` + stringify(parsed[key])) + '\n';
		});
		return result;
	} else if (typeof data === 'string'){
		return `"${data}"`;
	} else {
		return '' + data;
	}
};


module.export = {
	visualize_data: visualize_data,
};