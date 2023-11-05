import { useState } from 'react';

function useErrorHandling(initialErrors = {}) {
	const [errors, setErrors] = useState(initialErrors);

	function handleErrors(field, message) {
		setErrors((prev) => ({
			...prev,
			[field]: message,
		}));
	}

	function clearErrors(field) {
		setErrors((prev) => ({
			...prev,
			[field]: '',
		}));
	}

	return {
		errors,
		handleErrors,
		clearErrors,
	};
}

export { useErrorHandling };
