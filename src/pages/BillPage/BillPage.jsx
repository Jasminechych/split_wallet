import style from 'src/pages/BillPage/BillPage.module.scss';
import { useState, useRef, useEffect } from 'react';
import { PageTemplate } from 'src/pages/PageTemplate/PageTemplate';
import { Input } from 'src/components/Input/Input';
import { Select } from 'src/components/Select/Select';
import { ExpenseDistribution } from 'src/components/ExpenseDistribution/ExpenseDistribution';
import { round } from 'src/libraries/utils/round';
import { checkValidNumberInput } from 'src/libraries/utils/checkValidNumberInput';
// import { useGroupInfo } from 'src/contexts/GroupInfoContext';
import { useErrorHandling } from 'src/libraries/hooks/useErrorHandling';
import currencyData from 'src/assets/currencyData.json';

const memberData = [
	{ memberId: '1', memberName: 'AnnaGGGG' },
	{ memberId: '2', memberName: 'Tim' },
	{ memberId: '3', memberName: 'Bill' },
];

function BillPage() {
	const [billData, setBillData] = useState({
		billDate: '',
		billTitle: '',
		localExpense: '',
		localExpenseCurrency: '',
		actualExpense: '',
		actualExpenseCurrency: '',
		rate: '',
		payer: '單人付款',
		split: '平均分攤',
		payerPayments: {},
		splitPayments: {},
		debts: {},
	});

	// 紀錄當前 選到的 payer & split members
	const selectedSplitMemberRef = useRef([]);
	const selectedPayerMemberRef = useRef('');

	// const { groupInfo } = useGroupInfo();

	// 錯誤訊息管理 Hook
	const { errors, handleErrors, clearErrors } = useErrorHandling();

	console.log('渲染 BillPage');

	useEffect(() => {
		// 初始化資料格式
		const data = {};
		memberData.map(({ memberId }) => {
			data[memberId] = { amount: '0.00', isSelected: false };
		});
		setBillData((prev) => ({
			...prev,
			// 依 setup 待修正
			localExpenseCurrency: 'TWD',
			actualExpenseCurrency: 'TWD',
			payerPayments: data,
			splitPayments: data,
		}));
	}, []);

	//  payerPayments 計算未分配金額
	const payerPaymentsUnSettledAmount = calculateUnSettledAmount(billData.payerPayments);
	//  splitPayments 計算未分配金額
	const splitPaymentsUnSettledAmount = calculateUnSettledAmount(billData.splitPayments);

	function calculateUnSettledAmount(data) {
		let unSettled = Number(billData.localExpense);
		let sum = 0;

		sum = Object.values(data).reduce((acc, curr) => {
			return Number(acc) + Number(curr.amount);
		}, 0);

		unSettled = round(sum - Number(billData.localExpense), 2);

		return unSettled;
	}

	function handleBillDateChange(value) {
		setBillData((prev) => ({
			...prev,
			billDate: value,
		}));

		// 清除錯誤訊息
		clearErrors('billDate');
	}

	function handleBillTitleChange(value) {
		setBillData((prev) => ({
			...prev,
			billTitle: value,
		}));

		// 清除錯誤訊息
		clearErrors('billTitle');
	}

	function handleLocalExpenseChange(value) {
		setBillData((prev) => ({
			...prev,
			localExpense: value,
		}));

		if (!checkValidNumberInput(value)) {
			handleErrors('localExpense', '請輸入數字');
			return;
		}

		// 清除錯誤訊息
		clearErrors('localExpense');

		// 對 splitPayments 的更新
		if (billData.split === '平均分攤') {
			updateEqualSplitOrSinglePayerData('splitPayments', value, 'equalSplit');
		}

		// 對 payerPayments 的更新
		if (billData.payer === '單人付款' && selectedPayerMemberRef !== '') {
			updateEqualSplitOrSinglePayerData('payerPayments', value, 'singlePayer');
		}

		// 對 rate 的更新
		if (Number(billData.actualExpense) !== 0) {
			calculateRate(value, billData.actualExpense);
		}
	}

	function handleLocalExpenseCurrencyChange(value) {
		setBillData((prev) => ({
			...prev,
			localExpenseCurrency: value,
		}));
	}

	function handleActualExpenseChange(value) {
		setBillData((prev) => ({
			...prev,
			actualExpense: value,
		}));

		if (!checkValidNumberInput(value)) {
			handleErrors('actualExpense', '請輸入數字');
			return;
		}

		// 清除錯誤訊息
		clearErrors('actualExpense');

		// 對 rate 的更新
		calculateRate(billData.localExpense, value);
		// 清除錯誤訊息
		clearErrors('rate');
	}

	function handleActualExpenseCurrencyChange(value) {
		setBillData((prev) => ({
			...prev,
			actualExpenseCurrency: value,
		}));
	}

	function handleRateChange(value) {
		setBillData((prev) => ({
			...prev,
			rate: value,
		}));

		if (!checkValidNumberInput(value)) {
			handleErrors('rate', '請輸入數字');
			return;
		}

		// 清除錯誤訊息
		clearErrors('rate');

		// 對實 actualExpense 的更新
		setBillData((prev) => ({
			...prev,
			actualExpense:
				Number(value) === 0 || Number(billData.localExpense) === 0
					? ''
					: round(billData.localExpense / parseFloat(value), 2),
		}));

		// 清除錯誤訊息
		clearErrors('actualExpense');
	}

	function handlePayerChange(value) {
		setBillData((prev) => ({
			...prev,
			payer: value,
			payerPayments: Object.keys(prev.payerPayments).reduce((acc, key) => {
				acc[key] = { amount: '0.00', isSelected: false };
				return acc;
			}, {}),
		}));

		selectedPayerMemberRef.current = '';
	}

	function handleSplitChange(value) {
		setBillData((prev) => ({
			...prev,
			split: value,
			splitPayments: Object.keys(prev.splitPayments).reduce((acc, key) => {
				acc[key] = { amount: '0.00', isSelected: false };
				return acc;
			}, {}),
		}));

		selectedSplitMemberRef.current = [];
	}

	function handlePayerPaymentChange(id, value, type) {
		// 紀錄選中的成員
		selectedPayerMemberRef.current = id;

		if (type === 'singlePayer') {
			updateEqualSplitOrSinglePayerData('payerPayments', value, 'singlePayer');
		} else {
			setBillData((prev) => ({
				...prev,
				payerPayments: {
					...prev.payerPayments,
					[id]: { amount: round(value, 2) || '0.00', isSelected: false },
				},
			}));
		}

		// 清除錯誤訊息
		clearErrors('payerPayments');
	}

	function handleSplitPaymentChange(id, value, type) {
		if (type === 'equalSplit') {
			// 更新紀錄哪些成員 isSelected
			if (!selectedSplitMemberRef.current.includes(id)) {
				selectedSplitMemberRef.current.push(id);
			} else {
				const inputIdIndex = selectedSplitMemberRef.current.indexOf(id);
				selectedSplitMemberRef.current.splice(inputIdIndex, 1);
			}

			updateEqualSplitOrSinglePayerData('splitPayments', value, 'equalSplit');
			// type === 'exactSplit'
		} else {
			setBillData((prev) => ({
				...prev,
				splitPayments: {
					...prev.splitPayments,
					[id]: { amount: round(value, 2) || '0.00', isSelected: false },
				},
			}));
		}

		// 清除錯誤訊息
		clearErrors('splitPayments');
	}

	function calculateRate(inputDividend, inputDivisor) {
		const dividend = Number(inputDividend);
		const divisor = Number(inputDivisor);

		const invalidCalculation = dividend === 0 || divisor === 0;

		if (invalidCalculation) {
			setBillData((prev) => ({
				...prev,
				rate: '',
			}));
		} else {
			setBillData((prev) => ({
				...prev,
				rate: round(dividend / divisor, 3),
			}));
		}
	}

	function updateEqualSplitOrSinglePayerData(fieldName, inputValue, type) {
		setBillData((prev) => {
			const prevData = { ...prev[fieldName] };
			const updatedData = Object.keys(prevData).reduce((acc, key) => {
				const value = Number(inputValue);

				// 平均分攤
				if (type === 'equalSplit') {
					// 計算選中的成員數量
					const selectedMemberCount = selectedSplitMemberRef.current.length;
					// 得到最後一位被選中的成員要做餘額分配
					const lastSelectedMember =
						selectedSplitMemberRef.current[selectedSplitMemberRef.current.length - 1];

					// 計算分帳金額
					let splitAmount = 0;
					let remainderAmount = 0;
					if (value !== 0 && selectedMemberCount !== 0) {
						splitAmount = round(value / selectedMemberCount, 2);
						if (value - splitAmount * selectedMemberCount !== 0) {
							remainderAmount = round(value - Number(splitAmount) * selectedMemberCount, 2);
						}
					}
					// 如果是 selected 的成員同時又是最後一個選中的成員，做金額更新 + 餘額分配
					if (selectedSplitMemberRef.current.includes(key) && key === lastSelectedMember) {
						acc[key] = {
							amount: round(Number(splitAmount) + Number(remainderAmount), 2),
							isSelected: true,
						};
						// 如果是 selected 的成員，做金額更新
					} else if (selectedSplitMemberRef.current.includes(key)) {
						acc[key] = { amount: round(splitAmount, 2), isSelected: true };
						// 如果不是 selected 的成員，金額為 0
					} else {
						acc[key] = { amount: '0.00', isSelected: false };
					}
				}

				// 單人付款
				if (type === 'singlePayer') {
					if (selectedPayerMemberRef.current === key) {
						acc[key] = { amount: round(value, 2), isSelected: true };
					} else {
						acc[key] = { amount: '0.00', isSelected: false };
					}
				}

				return acc;
			}, {});
			return { ...prev, [fieldName]: updatedData };
		});
	}

	function calculateDebts() {
		let updatedDebts = {};

		for (const creditorId in billData.payerPayments) {
			for (const debtorId in billData.splitPayments) {
				const debtorSplitPayment = Number(billData.splitPayments[debtorId].amount);
				const debtorPayerPayment = Number(billData.payerPayments[debtorId].amount);
				const creditorSplitPayment = Number(billData.splitPayments[creditorId].amount);
				const creditorPayerPayment = Number(billData.payerPayments[creditorId].amount);

				// 潛在債務人
				const potentialDebtor =
					debtorSplitPayment > 0 || debtorSplitPayment - debtorPayerPayment > 0;

				if (!potentialDebtor || debtorId === creditorId) continue;

				// 債務人債款
				const debtorDebts = round(debtorSplitPayment - debtorPayerPayment, 2);

				// 潛在債權人
				const potentialCreditor = creditorPayerPayment - creditorSplitPayment > 0;

				if (!potentialCreditor) continue;

				// 債權人債款
				const creditorDebts = round(creditorPayerPayment - creditorSplitPayment, 2);

				// 建立債務關係
				updatedDebts[debtorId] = updatedDebts[debtorId] || {};

				// 債權人債款 >= 債務人債款，債務人債款 應全部給 債權人
				if (Number(creditorDebts) >= Number(debtorDebts)) {
					updatedDebts[debtorId][creditorId] = {
						amount: round(Number(debtorDebts) / Number(billData.rate), 2),
						currency: billData.actualExpenseCurrency,
					};
				} else {
					// 債權人債款 < 債務人債款，債務人 只需補足 債權人債款
					updatedDebts[debtorId][creditorId] = {
						amount: round(Number(creditorDebts) / Number(billData.rate), 2),
						currency: billData.actualExpenseCurrency,
					};
				}
			}
		}
		return updatedDebts;
	}

	// console.log('billData', billData);

	// 測試結果
	function handleButtonClick() {
		// 錯誤處理
		if (billData.billDate === '') {
			handleErrors('billDate', '請選擇消費日期');
		}

		if (billData.billTitle.trim() === '') {
			handleErrors('billTitle', '消費品項不得為空白');
		}

		if (Number(billData.localExpense) === 0) {
			handleErrors('localExpense', '當地消費金額不得為空白或 0');
		}

		if (Number(billData.actualExpense) === 0) {
			handleErrors('actualExpense', '實際帳單金額不得為空白或 0');
		}

		if (Number(billData.rate) === 0) {
			handleErrors('rate', '匯率不得為空白或 0');
		}

		if (payerPaymentsUnSettledAmount > 0) {
			handleErrors('payerPayments', '請分配帳款');
		}

		if (splitPaymentsUnSettledAmount > 0) {
			handleErrors('splitPayments', '請分配帳款');
		}

		const invalidInputs =
			billData.billDate === '' ||
			billData.billTitle.trim() === '' ||
			Number(billData.localExpense) === 0 ||
			Number(billData.actualExpense) === 0 ||
			Number(billData.rate) === 0 ||
			payerPaymentsUnSettledAmount > 0 ||
			splitPaymentsUnSettledAmount > 0;

		if (invalidInputs) return;

		// 計算債務關係
		const updatedDebts = calculateDebts();

		console.log('updatedDebts', updatedDebts);

		setBillData((prev) => ({
			...prev,
			debts: updatedDebts,
		}));
	}

	return (
		<PageTemplate pageTitle='新增消費' pageButtonTitle='新增' onClick={handleButtonClick}>
			<div className={style.billPage}>
				<Input
					className={style.billDate}
					title='消費日期'
					type='date'
					value={billData.billDate}
					onChange={(e) => handleBillDateChange(e.target.value)}
					error={errors.billDate}
				/>
				<Input
					className={style.billTitle}
					title='品項'
					type='text'
					placeholder='請輸入消費品項'
					value={billData.billTitle}
					onChange={(e) => handleBillTitleChange(e.target.value)}
					error={errors.billTitle}
				/>
				<Input
					className={style.localExpense}
					title='當地消費金額'
					type='number'
					placeholder='請輸入當地消費金額'
					value={billData.localExpense}
					onChange={(e) => handleLocalExpenseChange(e.target.value)}
					error={errors.localExpense}
					suffix={
						<Select
							optionsData={currencyData}
							value={billData.localExpenseCurrency}
							onChange={(e) => handleLocalExpenseCurrencyChange(e.target.value)}
							suffix='true'
						/>
					}
				/>
				<Input
					className={style.actualExpense}
					title='實際帳單金額 (與匯率擇一填寫)'
					type='number'
					placeholder='請輸入實際金額'
					value={billData.actualExpense}
					onChange={(e) => handleActualExpenseChange(e.target.value)}
					error={errors.actualExpense}
					suffix={
						<Select
							optionsData={currencyData}
							value={billData.actualExpenseCurrency}
							onChange={(e) => handleActualExpenseCurrencyChange(e.target.value)}
							suffix='true'
						/>
					}
				/>
				<Input
					className={style.rate}
					title='匯率 (與實際金額擇一填寫)'
					type='number'
					placeholder='請輸入匯率'
					value={billData.rate}
					onChange={(e) => handleRateChange(e.target.value)}
					error={errors.rate}
				/>
				<Select
					className={style.payer}
					title='誰付錢'
					optionsData={[
						{ key: 'single', value: '單人付款' },
						{ key: 'multiple', value: '多人付款' },
					]}
					value={billData.payer}
					onChange={(e) => handlePayerChange(e.target.value)}>
					{billData.payer === '單人付款' && (
						<ExpenseDistribution
							className={style.expenseDistributionForPayer}
							inputType='radio'
							inputName='singlePayer'
							memberData={memberData}
							localExpense={billData.localExpense}
							payer='single'
							payments={billData.payerPayments}
							onPaymentsChange={handlePayerPaymentChange}
							error={errors.payerPayments}
							unSettledAmount={payerPaymentsUnSettledAmount}
						/>
					)}

					{billData.payer === '多人付款' && (
						<ExpenseDistribution
							className={style.expenseDistributionForPayer}
							inputType='checkbox'
							inputName='multiplePayer'
							memberData={memberData}
							localExpense={billData.localExpense}
							payer='multiple'
							payments={billData.payerPayments}
							onPaymentsChange={handlePayerPaymentChange}
							error={errors.payerPayments}
							unSettledAmount={payerPaymentsUnSettledAmount}
						/>
					)}
				</Select>
				<Select
					className={style.split}
					title='分給誰'
					optionsData={[
						{ key: 'equal', value: '平均分攤' },
						{ key: 'exact', value: '各付各的' },
					]}
					value={billData.split}
					onChange={(e) => handleSplitChange(e.target.value)}>
					{billData.split === '平均分攤' && (
						<ExpenseDistribution
							className={style.expenseDistributionForSplit}
							inputType='checkbox'
							inputName='equalSplit'
							memberData={memberData}
							localExpense={billData.localExpense}
							payments={billData.splitPayments}
							onPaymentsChange={handleSplitPaymentChange}
							error={errors.splitPayments}
							unSettledAmount={splitPaymentsUnSettledAmount}
						/>
					)}
					{billData.split === '各付各的' && (
						<ExpenseDistribution
							className={style.expenseDistributionForSplit}
							inputType='checkbox'
							inputName='exactSplit'
							memberData={memberData}
							localExpense={billData.localExpense}
							payments={billData.splitPayments}
							onPaymentsChange={handleSplitPaymentChange}
							error={errors.splitPayments}
							unSettledAmount={splitPaymentsUnSettledAmount}
						/>
					)}
				</Select>
			</div>
		</PageTemplate>
	);
}

export { BillPage };
