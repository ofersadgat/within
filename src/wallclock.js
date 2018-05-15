

/*
 * getAngle returns the angle between the hour hand and the minute hand
 *
 * @param time   This is a string represting the time (e.g. '12:45')
 * @return The degrees between the minute hand and the hour hand as a float (e.g. 97.2)
 */

function getAngle(time){
	//convert the string to two integers
	let parts = time.split(':').map(function(part){ return parseInt(part); });

	//calculate normalize the values (minutes by 60, hours by 12) and add the percentages together
	let minutePercent = parts[1] / 60;

	//here we add before dividing to reduce float rounding errors
	let hourPercent = ((parts[0] % 12 + minutePercent) / 12);

	return Math.abs(minutePercent - hourPercent) * 360;
}

module.exports = {
	getAngle: getAngle
};
