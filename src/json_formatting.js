
let parseData; // (for eslint to not complain about usage before definition)

/*
 * parseObject will parse a string which starts with an object and return the object as the result
 * parameter and the rest of the string as the next parameter of the result object
 *
 * @param data   The string to parse into an object
 * @return An object with two parameters: next: this is the rest of the data string which was not
 *                             parsed and result: this contains the resulting object that wasparsed
 */
const parseObject = function parseObject(data) {
  // console.log('data i:', data);
  data = data.trim();
  if (!data.startsWith('{')) {
    return null;
  }
  const result = {};
  data = data.substring(1);
  data = data.trim();
  while (!data.startsWith('}')) {
    const key = parseData(data);
    if (key.result !== undefined) {
      data = key.next;
      data = data.trim();
      if (!data.startsWith(':')) {
        return null;
      }
      data = data.substring(1);
      data = data.trim();
      const value = parseData(data);
      result[key.result] = value.result;
      data = value.next;
    }

    if (data.startsWith(',')) {
      data = data.substring(1);
      data = data.trim();
    }
  }
  data = data.substring(1);
  return {
    result,
    next: data,
  };
};

/*
 * parseArray will parse an string which starts with an array and return the array as the result
 * parameter and the rest of the string as the next parameter of the result object
 *
 * @param data   The string to parse into an array
 * @return An object with two parameters: next: this is the rest of the data string which was not
 *                            parsed and result: this contains the resulting array that was parsed
 */
const parseArray = function parseArray(data) {
  data = data.trim();
  if (!data.startsWith('[')) {
    return null;
  }
  const result = [];
  data = data.substring(1);
  data = data.trim();
  while (!data.startsWith(']')) {
    const item = parseData(data);
    data = item.next;
    data = data.trim();
    if (item.result !== undefined) {
      result.push(item.result);
    }
    if (data.startsWith(',')) {
      data = data.substring(1);
      data = data.trim();
    }
  }
  data = data.substring(1);
  return {
    result,
    next: data,
  };
};

/*
 * parseString will parse an string which starts with an string (quotes really) and return the
 * string as the result parameter and the rest of the string as the next parameter of the result
 * object. This allows quotes to be escaped. I do not translate the escaped characters intionally
 * so that they will transer to the output as is.
 *
 * @param data   The string to parse into a string
 * @return An object with two parameters: next: this is the rest of the data string which was not
 *                         parsed and result: this contains the resulting string that was parsed
 */
const parseString = function parseString(data) {
  data = data.trim();
  if (!data.startsWith('"')) {
    return null;
  }
  data = data.substring(1);
  let i;
  let result = '';
  for (i = 0; i < data.length; i += 1) {
    if (data[i] === '\\') {
      i += 1;
      result = `${result}\\${data[i]}`;
    }
    if (data[i] === '"') {
      break;
    }
    result += data[i];
  }
  i = Math.min(i, data.length - 1);
  return {
    result,
    next: data.substring(i + 1),
  };
};

/*
 * parseData will parse any string which contains our json like grammar and return the result
 * in the result parameter and the rest of the string as the next parameter
 *
 * @param data   The string to parse into an array
 * @return An object with two parameters: next: this is the rest of the data string which was not
 *                             parsed and result: this contains the resulting array that was parsed
 */
/* eslint-disable no-shadow */
parseData = function parseData(data) {
/* eslint-enable no-shadow */
  data = data.trim();
  if (data.startsWith('{')) {
    return parseObject(data);
  } else if (data.startsWith('[')) {
    return parseArray(data);
  } else if (data.toLowerCase().startsWith('true')) {
    return {
      result: true,
      next: data.substring('true'.length),
    };
  } else if (data.toLowerCase().startsWith('false')) {
    return {
      result: false,
      next: data.substring('false'.length),
    };
  } else if (data.startsWith('"')) {
    return parseString(data);
  } else if (data.length > 0 && (data[0] === '.' || (data[0] > '0' && data[0] < '9'))) {
    let i = 0;
    let seenDot = false;
    // we cant rely on the ('' + parseFloat(data)).length here due to floats not being able to
    // express every number exactly
    for (i = 0; i < data.length; i += 1) {
      if (data[i] === '.') {
        if (seenDot) {
          break;
        }
        seenDot = true;
      } else if (data[i] < '0' || data[i] > '9') {
        break;
      }
    }
    const result = parseFloat(data.substring(0, i));
    return {
      result,
      next: data.substring(i),
    };
  }
  return {
    result: undefined,
    next: data,
  };
};

/*
 * repeat will just repeat a string count times.
 *
 * @param str     The string to repeat
 * @param count   The number of times to repeat the string
 * @return the string repeated count times
 */
const repeat = function repeat(str, count) {
  let result = '';
  for (let i = 0; i < count; i += 1) {
    result += str;
  }
  return result;
};

/*
 * stringifyData will take a javascript object and output it in our desired format
 *
 * @param data    The json object to stringify
 * @param depth   (Do not pass this parameter) This is to keep track of how deep our
 *                        recursive call is to control the indenting
 * @return The stringified result
 */
const stringifyData = function stringifyData(data, depth = -1) {
  if (Array.isArray(data)) {
    let result = `\n${repeat('\t', depth)}[\n`;
    data.forEach((item) => {
      result = `${result + repeat('\t', depth + 1) + stringifyData(item, depth + 1)}\n`;
    });
    return `${result + repeat('\t', depth)}]`;
  } else if (typeof data === 'object') {
    let result = depth === -1 ? '' : `\n${repeat('\t', depth)}{\n`;
    Object.keys(data).sort().forEach((key) => {
      result = `${result + repeat('\t', depth + 1)}"${key}": ${stringifyData(data[key], depth + 1)}\n`;
    });
    result = depth === -1 ? result.substring(0, result.length - 1) : `${result + repeat('\t', depth)}}`;
    return result;
  } else if (typeof data === 'string') {
    return `"${data}"`;
  }
  return `${data}`;
};


/*
 * visualize_data will parse the json like string and output our desired format to the console.
 *
 * @param data   The string to parse and then output
 * @return
 */

/* eslint-disable no-console, camelcase */
const visualize_data = function visualize_data(data) {
  const parsed = parseData(data).result;
  console.log(stringifyData(parsed));
};
/* eslint-enable no-console, camelcase */


module.exports = {
  parseData,
  parseString,
  parseObject,
  parseArray,
  visualize_data,
  stringifyData,
};
