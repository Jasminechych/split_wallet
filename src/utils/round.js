function round(number, digits) {
	const multiplier = Math.pow(10, digits);
	return (Math.round(number * multiplier) / multiplier).toFixed(digits);
}
export { round };
