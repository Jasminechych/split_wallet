// function round(number, digits) {
// 	const multiplier = Math.pow(10, digits);
// 	return (Math.round(number * multiplier) / multiplier).toFixed(digits);
// }
// export { round };

function round(number, digits) {
	const multiplier = Math.pow(10, digits);
	const roundedNumber = Math.round(number * multiplier) / multiplier;
	return parseFloat(roundedNumber.toFixed(digits));
}

export { round };
