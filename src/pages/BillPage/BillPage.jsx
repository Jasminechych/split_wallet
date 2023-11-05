import style from 'src/pages/BillPage/BillPage.module.scss';
import { useState, useRef, useEffect } from 'react';
import { PageTemplate } from 'src/pages/PageTemplate/PageTemplate';
import { Input } from 'src/components/Input/Input';
import { Select } from 'src/components/Select/Select';
import { ExpenseDistribution } from 'src/components/ExpenseDistribution/ExpenseDistribution';
import { round } from 'src/libraries/utils/round';
import { useGroupInfo } from 'src/contexts/GroupInfoContext';
import { useErrorHandling } from 'src/libraries/hooks/useErrorHandling';
import currencyData from 'src/assets/currencyData.json';

const memberData = [
	{ memberId: '1', memberName: 'AnnaGGGG' },
	{ memberId: '2', memberName: 'Tim' },
	{ memberId: '3', memberName: 'Bill' },
];

function BillPage() {
	const [billDate, setBillDate] = useState('');
	const [billTitle, setBillTitle] = useState('');
	const [localExpense, setLocalExpense] = useState('');
	const [localExpenseCurrency, setLocalExpenseCurrency] = useState('');
	const [actualExpense, setActualExpense] = useState('');
	const [actualExpenseCurrency, setActualExpenseCurrency] = useState('');
	const [rate, setRate] = useState('');
	const [payer, setPayer] = useState('單人付款');
	const [split, setSplit] = useState('平均分攤');
	const [payerPayments, setPayerPayments] = useState({});
	const [splitPayments, setSplitPayments] = useState({});

	const selectedMemberRef = useRef({});
	const { groupInfo } = useGroupInfo();
	// 使用錯誤訊息管理
	const { errors, handleErrors, clearErrors } = useErrorHandling();

	console.log('渲染 BillPage');
	console.log('groupInfo', groupInfo);

	useEffect(() => {
		// 初始化資料格式
		const data = {};
		memberData.map(({ memberId }) => {
			data[memberId] = { amount: 0, isSelected: false };
		});
		setPayerPayments(data);
		setSplitPayments(data);
	}, []);

	//  payerPayments 計算未分配金額
	let splitPaymentsUnSettledAmount = localExpense || 0;
	let splitPaymentsSum = 0;

	splitPaymentsSum = Object.values(splitPayments).reduce((acc, curr) => {
		return Number(acc) + Number(curr.amount);
	}, 0);

	if (splitPaymentsSum === 0) {
		splitPaymentsUnSettledAmount = parseFloat(localExpense - splitPaymentsSum);
	} else {
		splitPaymentsUnSettledAmount = parseFloat(splitPaymentsSum - localExpense);
	}

	//  splitPayments 計算未分配金額
	let payerPaymentsUnSettledAmount = localExpense || 0;
	let payerPaymentsSum = 0;

	payerPaymentsSum = Object.values(payerPayments).reduce((acc, curr) => {
		return Number(acc) + Number(curr.amount);
	}, 0);

	if (payerPaymentsSum === 0) {
		payerPaymentsUnSettledAmount = parseFloat(localExpense - payerPaymentsSum);
	} else {
		payerPaymentsUnSettledAmount = parseFloat(payerPaymentsSum - localExpense);
	}

	function handleBillDateChange(value) {
		setBillDate(value);

		// 清除錯誤訊息
		clearErrors('billDate');
	}

	function handleBillTitleChange(value) {
		setBillTitle(value);

		// 清除錯誤訊息
		clearErrors('billTitle');
	}

	function handleLocalExpenseChange(value) {
		setLocalExpense(value);

		// 處理 splitPayments 的 equalSplit 同步更新
		// if (splitPayments !== null && splitPayments !== undefined) {
		const selectedMemberCount = Object.values(selectedMemberRef.current).filter(
			(item) => item === true,
		).length;

		// 計算分帳金額
		let splitAmount = 0;
		let remainderAmount = 0;
		if (value !== 0 && selectedMemberCount !== 0) {
			splitAmount = round(value / selectedMemberCount, 2);

			if (value - splitAmount * selectedMemberCount !== 0) {
				remainderAmount = (value - splitAmount * selectedMemberCount).toFixed(2);
			}
		}

		// 找到最後一個有被選中的 memberId 做餘額分配
		const lastSelectedMember = Object.keys(selectedMemberRef.current)[
			Object.keys(selectedMemberRef.current).length - 1
		];

		// 對 splitPayments 的更新
		Object.entries(splitPayments).forEach(([id, item]) => {
			if (item.isSelected === true) {
				setSplitPayments((prev) => ({
					...prev,
					[id]: {
						amount:
							id === lastSelectedMember
								? (Number(splitAmount) + Number(remainderAmount)).toFixed(2)
								: round(value / selectedMemberCount, 2),
						isSelected: true,
					},
				}));
			}
		});
		// }

		// 對 payerPayments 的更新
		if (payerPayments !== null && payerPayments !== undefined) {
			Object.entries(payerPayments).forEach(([id, item]) => {
				if (item.isSelected === true) {
					setPayerPayments((prev) => ({
						...prev,
						[id]: {
							amount: round(value, 2),
							isSelected: true,
						},
					}));
				}
			});
		}

		// 對 rate 的更新
		// 排除空字串或非數字的情況
		if (value === '' || isNaN(value)) {
			setRate('');
			return;
		}
		// 排除 0.0 幾皆為 0 的狀況
		const floatValue = parseFloat(value);
		if (floatValue === 0 || actualExpense === 0 || actualExpense === '') {
			setRate('');
		} else {
			setRate(round(floatValue / actualExpense, 3));

			// 清除錯誤訊息
			clearErrors('rate');
		}

		// 清除錯誤訊息
		clearErrors('localExpense');
	}

	function handleLocalExpenseCurrencyChange(value) {
		setLocalExpenseCurrency(value);
	}

	function handleActualExpenseChange(value) {
		setActualExpense(value);

		// 對 rate 的更新
		// 排除空字串或非數字的情況
		if (value === '' || isNaN(value)) {
			setRate('');
			return;
		}

		// 排除 0.0 幾皆為 0 的狀況
		const floatValue = parseFloat(value);
		if (floatValue === 0 || localExpense === 0 || localExpense === '') {
			setRate('');
		} else {
			setRate(round(localExpense / floatValue, 3));

			// 清除錯誤訊息
			clearErrors('rate');
		}

		// 清除錯誤訊息
		clearErrors('actualExpense');
	}

	function handleActualExpenseCurrencyChange(value) {
		setActualExpenseCurrency(value);
	}

	function handleRateChange(value) {
		setRate(value);

		// 對實 actualExpense 的更新
		// 排除空字串或非數字的情況
		if (value === '' || isNaN(value)) {
			setActualExpense('');
			return;
		}

		// 排除 0.0 幾皆為 0 的狀況
		const floatValue = parseFloat(value);
		if (floatValue === 0 || localExpense === 0 || localExpense === '') {
			setActualExpense('');
		} else {
			setActualExpense(round(localExpense / floatValue, 2));

			// 清除錯誤訊息
			clearErrors('actualExpense');
		}

		// 清除錯誤訊息
		clearErrors('rate');
	}

	function handlePayerChange(value) {
		setPayerPayments((prev) => {
			const updatedPayments = Object.keys(prev).reduce((acc, key) => {
				acc[key] = { amount: 0, isSelected: false };
				return acc;
			}, {});
			return updatedPayments;
		});
		setPayer(value);
	}

	function handleSplitChange(value) {
		setSplitPayments({});
		setSplit(value);
		selectedMemberRef.current = {};
	}

	function handlePayerPaymentChange(id, value, type) {
		if (type === 'singlePayer') {
			setPayerPayments((prev) => {
				const updatedPayments = Object.keys(prev).reduce((acc, key) => {
					acc[key] = { amount: 0, isSelected: false };
					return acc;
				}, {});
				updatedPayments[id] = { amount: round(localExpense, 2), isSelected: true };
				return updatedPayments;
			});
		} else {
			setPayerPayments((prev) => ({
				...prev,
				[id]: { amount: round(value, 2) || 0, isSelected: false },
			}));
		}

		// 清除錯誤訊息
		clearErrors('payerPayments');
	}

	function handleSplitPaymentChange(id, value, type) {
		if (type === 'equalSplit') {
			selectedMemberRef.current[id] = !selectedMemberRef.current[id];

			const selectedMemberCount = Object.values(selectedMemberRef.current).filter(
				(item) => item === true,
			).length;

			// 計算分帳金額
			let splitAmount = 0;
			let remainderAmount = 0;
			if (value !== 0 && selectedMemberCount !== 0) {
				splitAmount = round(value / selectedMemberCount, 2);

				if (value - splitAmount * selectedMemberCount !== 0) {
					remainderAmount = (value - splitAmount * selectedMemberCount).toFixed(2);
				}
			}

			// 更新所有已選中成員的金額
			if (splitPayments !== null && splitPayments !== undefined) {
				Object.entries(splitPayments).forEach(([memberId, item]) => {
					if (item.isSelected === true) {
						setSplitPayments((prev) => ({
							...prev,
							[memberId]: {
								amount: splitAmount,
								isSelected: true,
							},
						}));
					}
				});
			}

			// 更新合併此次收到的資料
			setSplitPayments((prev) => ({
				...prev,
				[id]: {
					amount:
						prev[id] && prev[id].amount !== 0
							? 0
							: (Number(splitAmount) + Number(remainderAmount)).toFixed(2), // 如果平均分配除不盡的話將餘額分配給最後選到的人
					isSelected: prev[id] && prev[id].isSelected === true ? false : true,
				},
			}));
			// exactSplit
		} else {
			setSplitPayments((prev) => ({
				...prev,
				[id]: { amount: round(value, 2) || 0, isSelected: false },
			}));
		}

		// 清除錯誤訊息
		clearErrors('splitPayments');
	}

	// 測試結果用
	function handleButtonClick() {
		// 錯誤處理
		if (billDate === '') {
			handleErrors('billDate', '請選擇消費日期');
		}

		if (billTitle.trim() === '') {
			handleErrors('billTitle', '消費品項不得為空白');
		}

		if (localExpense === '' || localExpense === '0' || localExpense === 0) {
			handleErrors('localExpense', '當地消費金額不得為空白或 0');
		}

		if (actualExpense === '' || actualExpense === '0' || actualExpense === 0) {
			handleErrors('actualExpense', '實際帳單金額不得為空白或 0');
		}

		if (rate === '' || rate === '0' || rate === 0) {
			handleErrors('rate', '匯率不得為空白或 0');
		}

		if (payerPaymentsUnSettledAmount > 0) {
			handleErrors('payerPayments', '請分配帳款');
		}

		if (splitPaymentsUnSettledAmount > 0) {
			handleErrors('splitPayments', '請分配帳款');
		}

		if (
			billDate === '' ||
			billTitle.trim() === '' ||
			localExpense === '' ||
			localExpense === '0' ||
			localExpense === 0 ||
			actualExpense === '' ||
			actualExpense === '0' ||
			actualExpense === 0 ||
			rate === '' ||
			rate === '0' ||
			rate === 0 ||
			payerPaymentsUnSettledAmount > 0 ||
			splitPaymentsUnSettledAmount > 0
		) {
			return;
		}

		// console.log('billDate', billDate);
		// console.log('billTitle', billTitle);
		// console.log('localExpense', localExpense);
		// console.log('localExpenseCurrency', localExpenseCurrency);
		// console.log('actualExpense', actualExpense);
		// console.log('actualExpenseCurrency', actualExpenseCurrency);
		// console.log('rate', rate);
		// console.log('payer', payer);
		// console.log('split', split);
		console.log('payerPayments', payerPayments);
		console.log('splitPayments', splitPayments);

		// 計算債務關係
		const debts = {};
		for (const payerId in payerPayments) {
			for (const splitId in splitPayments) {
				// 分帳金額	> 0 && 該付的大於支出的 才有可能欠別人錢
				if (
					splitId !== payerId &&
					splitPayments[splitId].amount > 0 &&
					splitPayments[splitId].amount - payerPayments[splitId].amount > 0
				) {
					// 表示我總共欠大家的錢
					const shortage = splitPayments[splitId].amount - payerPayments[splitId].amount;
					// 如果他的付款金額 > 分帳金額，表示我可能人欠他錢
					if (payerPayments[payerId].amount - splitPayments[payerId].amount > 0) {
						// 表示他被欠的錢
						const debt = payerPayments[payerId].amount - splitPayments[payerId].amount;
						debts[splitId] = debts[splitId] || {};
						// 如果他被欠的錢大於我總共欠的錢，我就是欠他我全部欠的錢
						if (debt >= shortage) {
							debts[splitId][payerId] = round(shortage / rate, 2);
						} else {
							// 如果他被欠的錢小於我總共欠的錢，我就是欠他他被欠的錢
							debts[splitId][payerId] = round(debt / rate, 2);
						}
					}
				}
			}
		}

		console.log('debts', debts);
	}

	return (
		<PageTemplate pageTitle='新增消費' pageButtonTitle='新增' onClick={handleButtonClick}>
			<div className={style.billPage}>
				<Input
					className={style.billDate}
					title='消費日期'
					type='date'
					value={billDate}
					onChange={(e) => handleBillDateChange(e.target.value)}
					error={errors.billDate}
				/>
				<Input
					className={style.billTitle}
					title='品項'
					type='text'
					placeholder='請輸入消費品項'
					value={billTitle}
					onChange={(e) => handleBillTitleChange(e.target.value)}
					error={errors.billTitle}
				/>
				<Input
					className={style.localExpense}
					title='當地消費金額'
					type='number'
					placeholder='請輸入當地消費金額'
					value={localExpense}
					onChange={(e) => handleLocalExpenseChange(e.target.value)}
					error={errors.localExpense}
					suffix={
						<Select
							optionsData={currencyData}
							value={localExpenseCurrency}
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
					value={actualExpense}
					onChange={(e) => handleActualExpenseChange(e.target.value)}
					error={errors.actualExpense}
					suffix={
						<Select
							optionsData={currencyData}
							value={actualExpenseCurrency}
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
					value={rate}
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
					value={payer}
					onChange={(e) => handlePayerChange(e.target.value)}>
					{payer === '單人付款' && (
						<ExpenseDistribution
							className={style.expenseDistributionForPayer}
							inputType='radio'
							inputName='singlePayer'
							memberData={memberData}
							localExpense={localExpense}
							payer='single'
							payments={payerPayments}
							onPaymentsChange={handlePayerPaymentChange}
							error={errors.payerPayments}
							sum={payerPaymentsSum}
							unSettledAmount={payerPaymentsUnSettledAmount}
						/>
					)}

					{payer === '多人付款' && (
						<ExpenseDistribution
							className={style.expenseDistributionForPayer}
							inputType='checkbox'
							inputName='multiplePayer'
							memberData={memberData}
							localExpense={localExpense}
							payer='multiple'
							payments={payerPayments}
							onPaymentsChange={handlePayerPaymentChange}
							error={errors.payerPayments}
							sum={payerPaymentsSum}
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
					value={split}
					onChange={(e) => handleSplitChange(e.target.value)}>
					{split === '平均分攤' && (
						<ExpenseDistribution
							className={style.expenseDistributionForSplit}
							inputType='checkbox'
							inputName='equalSplit'
							memberData={memberData}
							localExpense={localExpense}
							payments={splitPayments}
							onPaymentsChange={handleSplitPaymentChange}
							error={errors.splitPayments}
							sum={splitPaymentsSum}
							unSettledAmount={splitPaymentsUnSettledAmount}
						/>
					)}
					{split === '各付各的' && (
						<ExpenseDistribution
							className={style.expenseDistributionForSplit}
							inputType='checkbox'
							inputName='exactSplit'
							memberData={memberData}
							localExpense={localExpense}
							payments={splitPayments}
							onPaymentsChange={handleSplitPaymentChange}
							error={errors.splitPayments}
							sum={splitPaymentsSum}
							unSettledAmount={splitPaymentsUnSettledAmount}
						/>
					)}
				</Select>
			</div>
		</PageTemplate>
	);
}

export { BillPage };
