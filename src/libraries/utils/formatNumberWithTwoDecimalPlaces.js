function formatNumberWithTwoDecimalPlaces(inputValue) {
	// 移除非数字字符
	inputValue = inputValue.replace(/[^0-9.]/g, '');

	// 限制小数位数为两位
	const decimalIndex = inputValue.indexOf('.');
	if (decimalIndex !== -1) {
		inputValue = inputValue.slice(0, decimalIndex + 3);
	}

	// 如果用户输入的是小数点开头，添加0
	if (inputValue === '.') {
		inputValue = '0' + inputValue;
	}

	// 确保最后一位是小数点后的两位
	const parts = inputValue.split('.');
	if (parts.length > 1) {
		parts[1] = parts[1].padEnd(2, '0');
		inputValue = parts.join('.');
	} else {
		inputValue += '.00';
	}

	return inputValue;
}

export { formatNumberWithTwoDecimalPlaces };
