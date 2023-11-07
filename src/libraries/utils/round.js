function round(InputNumber, digits) {
	const number = Number(InputNumber);
	const multiplier = Math.pow(10, digits);
	return (Math.round(number * multiplier) / multiplier).toFixed(digits);
}
export { round };
