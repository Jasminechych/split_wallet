const baseUrl = 'https://v6.exchangerate-api.com/v6/96f5d9e1a8fc316f80a00112/latest/';

const getRate = async (baseCode) => {
	try {
		const response = await fetch(`${baseUrl}${baseCode}`);
		const result = await response.json();
		const data = result.conversion_rates;

		return data;
	} catch (e) {
		console.error('getRate failed', e);
	}
};

export { getRate };
