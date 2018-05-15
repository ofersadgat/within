

function getAngle(time){
	let parts = time.split(':').map(function(part){ return parseInt(part); });
	let minutePercent = parts[1] / 60;
	let hourPercent = ((parts[0] % 12) / 12) + minutePercent * (1 / 12);

	return Math.abs(minutePercent - hourPercent) * 360;
}

module.exports = {
	getAngle: getAngle
};
