function checkValidNumberInput(inputValue) {
	const regex = /^[0-9]+(\.[0-9]+)?$/;

	return regex.test(inputValue);
}

export { checkValidNumberInput };
