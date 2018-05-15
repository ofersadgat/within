

/*
 * parse_object will parse a string which starts with an object and return the object as the result
 * parameter and the rest of the string as the next parameter of the result object
 *
 * @param data   The string to parse into an object
 * @return An object with two parameters: next: this is the rest of the data string which was not parsed
 *                                  and result: this contains the resulting object that was parsed
 */
let parse_object = function(data) {
	// console.log('data i:', data);
	data = data.trim();
	if (!data.startsWith('{')){
		return null;
	}
	let result = {};
	data = data.substring(1);
	data = data.trim();
	while (!data.startsWith('}')){
		let key = parse_data(data);
		if (key.result !== undefined){
			data = key.next;
			data = data.trim();
			if (!data.startsWith(':')){
				return null;
			}
			data = data.substring(1);
			data = data.trim();
			let value = parse_data(data);
			result[key.result] = value.result;
			data = value.next;
		}

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

/*
 * parse_array will parse an string which starts with an array and return the array as the result
 * parameter and the rest of the string as the next parameter of the result object
 *
 * @param data   The string to parse into an array
 * @return An object with two parameters: next: this is the rest of the data string which was not parsed
 *                                  and result: this contains the resulting array that was parsed
 */
let parse_array = function(data) {
	data = data.trim();
	if (!data.startsWith('[')){
		return null;
	}
	let result = [];
	data = data.substring(1);
	data = data.trim();
	while (!data.startsWith(']')){
		let item = parse_data(data);
		data = item.next;
		data = data.trim();
		if (item.result !== undefined){
			result.push(item.result);
		}
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

/*
 * parse_string will parse an string which starts with an string (quotes really) and return the string as the result
 * parameter and the rest of the string as the next parameter of the result object. This allows quotes to be escaped.
 * I do not translate the escaped characters intionally so that they will transer to the output as is.
 *
 * @param data   The string to parse into a string
 * @return An object with two parameters: next: this is the rest of the data string which was not parsed
 *                                  and result: this contains the resulting string that was parsed
 */
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
			result = result + '\\' + data[i];
		}
		if (data[i] === '"'){
			break;
		}
		result = result + data[i];
	}
	i = Math.min(i, data.length - 1);
	return {
		result: result,
		next: data.substring(i + 1),
	};
};

/*
 * parse_data will parse any string which contains our json like grammar and return the result in the result
 * parameter and the rest of the string as the next parameter
 *
 * @param data   The string to parse into an array
 * @return An object with two parameters: next: this is the rest of the data string which was not parsed
 *                                  and result: this contains the resulting array that was parsed
 */
let parse_data = function(data) {
	data = data.trim();
	if (data.startsWith('{')){
		return parse_object(data);
	} else if (data.startsWith('[')){
		return parse_array(data);
	} else if (data.toLowerCase().startsWith('true')){
		return {
			result: true,
			next: data.substring('true'.length),
		};
	} else if (data.toLowerCase().startsWith('false')){
		return {
			result: false,
			next: data.substring('false'.length),
		};
	} else if (data.startsWith('"')){
		return parse_string(data);
	} else if (data.length > 0 && (data[0] === '.' || (data[0] > '0' && data[0] < '9'))) {
		let i = 0;
		let seenDot = false;
		//we cant rely on the ('' + parseFloat(data)).length here due to floats not being able to express every number exactly
		for (i = 0; i < data.length; i++){
			if (data[i] === '.'){
				if (seenDot){
					break;
				}
				seenDot = true;
			} else if (data[i] < '0' || data[i] > '9'){
				break;
			}
		}
		let result = parseFloat(data.substring(0, i)); 
		return {
			result: result,
			next: data.substring(i)
		};
	} else {
		return {
			result: undefined,
			next: data,
		};
	}
}

/*
 * visualize_data will parse the json like string and output our desired format to the console.
 *
 * @param data   The string to parse and then output
 * @return
 */
let visualize_data = function( data ){
	let parsed = parse_data(data).result;
	console.log(stringify_data(parsed));
};

/*
 * repeat will just repeat a string count times.
 *
 * @param str     The string to repeat
 * @param count   The number of times to repeat the string
 * @return the string repeated count times
 */
let repeat = function( str, count ){
	let result = '';
	for (let i = 0; i < count; i++){
		result = result + str;
	}
	return result;
};

/*
 * stringify_data will take a javascript object and output it in our desired format
 *
 * @param data    The json object to stringify
 * @param depth   (Do not pass this parameter) This is to keep track of how deep our recursive call is to control the indenting
 * @return The stringified result
 */
let stringify_data = function( data , depth = -1){
	if (Array.isArray(data)){
		let result = '\n' + repeat('\t', depth) + '[\n';
		data.forEach(function(item) {
			result = result + repeat('\t', depth + 1) + stringify_data(item, depth + 1) + '\n';
		});
		return result + repeat('\t', depth) + ']';
	} else if (typeof data === 'object'){
		let result = depth === -1 ? '' : '\n' + repeat('\t', depth) + '{\n';
		Object.keys(data).sort().forEach(function(key){
			result = result + repeat('\t', depth + 1) +  `"${key}": ` + stringify_data(data[key], depth + 1) + '\n';
		});
		result = depth === -1 ? result.substring(0, result.length - 1) : result + repeat('\t', depth) + '}';
		return result;
	} else if (typeof data === 'string'){
		return `"${data}"`;
	} else {
		return '' + data;
	}
};


module.exports = {
	parse_data: parse_data,
	parse_string: parse_string,
	parse_object: parse_object,
	parse_array: parse_array,
	visualize_data: visualize_data,
	stringify_data: stringify_data,
};