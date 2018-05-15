
let parse_object = function(data) {
	if (!data.startsWith('{')){
		return null;
	}
	let result = {};
	data = data.substring(1);
	data = data.trim();
	while (!data.startsWith('}')){
		let key = parse_data(data);
		data = key.next;
		data = data.trim();
		if (!data.startsWith(':')){
			return null;
		}
		data = data.substring(1);
		data = data.trim();
		let value = parse_data(data);
		data = value.next;

		if (data.startsWith(',')){
			data = data.substring(1);
			data = data.trim();
		}
	}
	data = data.substring(1);
	return {
		result: result,
		next: data,
	};
};

let escapes = {
	'n': '\n',
	'r': '\r',
	'f': '\f',
	'"': '"',
	'\\': '\\',
};

let parse_string = function(data) {
	data = data.trim();
	if (!data.startsWith('"')){
		return null;
	}
	let wasEscape = false;
	data = data.substring(1);
	let i;
	let result = '';
	for (i = 0; i < data.length; i++){
		if (data[i] === '\\'){
			i++;
			result = result + escapes[data[i]];
		}
		if (data[i] === '"'){
			break;
		}
		result = result + data[i];
	}
	i = Math.min(i, data.length - 1);
	return {
		result: result,
		next: data.substring(i + 1);
	};
};

let parse_data = function(data) {
	data = data.trim();
	if (data.startsWith('{')){
		return parse_object(data);
	} else if (data.startsWith('[')){

	} else if (data.toLowerCase().startsWith('true')){
		return {
			result: true,
			next: data.substring('true'.length);
		};
	} else if (data.toLowerCase().startsWith('false')){
		return {
			result: false,
			next: data.substring('false'.length);
		};
	} else if (data.startsWith('"')){
		return parse_string(data);
	} else if (data.indexOf('.') !== -1){
		return parseFloat(data);
	} else {
		return parseInt(data);
	}
}

let visualize_data = function( data ){
	let parsed = JSON.parse(data);
	console.log(stringify_data(parsed));
};

let repeat = function( str, count ){
	let result = '';
	for (let i = 0; i < count; i++){
		result = result + str;
	}
	return result;
};

let stringify_data = function( data , depth = 0){
	if (Array.isArray(data)){
		let result = '\n' + repeat('\t', depth) + '[\n';
		data.forEach(function(item) {
			result = result + repeat('\t', depth + 1) + stringify_data(item, depth + 1) + '\n';
		});
		return result + repeat('\t', depth) + ']';
	} else if (typeof data === 'object'){
		let result = depth === 0 ? '' : repeat('\t', depth) + '{\n';
		Object.keys(parsed).sort().forEach(function(key){
			result = result + repeat('\t', depth + 1) +  `"${key}": ` + stringify(parsed[key], depth + 1) + '\n';
		});
		result = depth === 0 ? result : result + repeat('\t', depth) + '}';
		return result;
	} else if (typeof data === 'string'){
		return `"${data}"`;
	} else {
		return '' + data;
	}
};


module.export = {
	visualize_data: visualize_data,
	stringify_data: stringify_data,
};