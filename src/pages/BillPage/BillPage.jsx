import style from 'src/pages/BillPage/BillPage.module.scss';
import { useState, useRef } from 'react';
import { PageTemplate } from 'src/pages/PageTemplate/PageTemplate';
import { Input } from 'src/components/Input/Input';
import { Select } from 'src/components/Select/Select';
import { ExpenseDistribution } from 'src/components/ExpenseDistribution/ExpenseDistribution';
import { round } from 'src/utils/round';
import { useGroupInfo } from 'src/context/GroupInfoContext';
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
	// const [tax, setTax] = useState('');
	// const [discount, setDiscount] = useState('');

	const selectedMemberRef = useRef({});
	const { groupInfo } = useGroupInfo();

	console.log('渲染 BillPage');
	console.log('groupInfo', groupInfo);

	function handleBillDateChange(value) {
		setBillDate(value);
	}

	function handleBillTitleChange(value) {
		setBillTitle(value);
	}

	function handlePayerChange(value) {
		setPayerPayments({});
		setPayer(value);
	}

	function handleSplitChange(value) {
		setSplitPayments({});
		setSplit(value);
		selectedMemberRef.current = {};
	}

	function handleLocalExpenseChange(value) {
		setLocalExpense(value);

		// 處理 splitPayments 的 equalSplit 同步更新
		if (splitPayments !== null && splitPayments !== undefined) {
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
		}

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
		}
	}

	function handleLocalExpenseCurrencyChange(value) {
		setLocalExpenseCurrency(value);
		console.log('setLocalExpenseCurrency', value);
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
		}
	}

	function handleActualExpenseCurrencyChange(value) {
		setActualExpenseCurrency(value);
		console.log('setActualExpenseCurrency', value);
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
		}
	}

	function handlePayerPaymentChange(id, value, type) {
		let updatedPayments;

		if (type === 'radio') {
			updatedPayments = {
				[id]: { amount: round(localExpense, 2), isSelected: true },
			};
		} else {
			updatedPayments = {
				...payerPayments,
				[id]: { amount: round(value, 2) || 0, isSelected: false },
			};
		}
		setPayerPayments(updatedPayments);
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
	}

	// function handleTaxChange(value) {
	// 	setTax(value);
	// }

	// function handleDiscountChange(value) {
	// 	setDiscount(value);
	// }

	// 測試結果用
	function handleButtonClick() {
		console.log('payerPayments', payerPayments);
		console.log('splitPayments', splitPayments);
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
				/>
				<Input
					className={style.billTitle}
					title='品項'
					type='text'
					placeholder='請輸入品項'
					value={billTitle}
					onChange={(e) => handleBillTitleChange(e.target.value)}
				/>
				<Input
					className={style.localExpense}
					title='當地消費金額'
					type='number'
					placeholder='請輸入當地消費金額'
					value={localExpense}
					onChange={(e) => handleLocalExpenseChange(e.target.value)}
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
						/>
					)}
				</Select>

				{/* 待確認 */}
				{/* <Input
					title='折扣 (選填)'
					type='number'
					value={discount}
					onChange={(e) => handleDiscountChange(e.target.value)}
					suffix='%'
				/> */}
				{/* 試算待刪除 */}
				{/* <p>
					折扣金額 {Number(localExpense) * discount * 0.01} 折扣後總金額{' '}
					{Number(localExpense) - Number(localExpense) * discount * 0.01}
				</p> */}
				{/* <Input
					title='稅 / 服務費 (選填)'
					type='number'
					value={tax}
					onChange={(e) => handleTaxChange(e.target.value)}
					suffix='%'
				/> */}
				{/* <p>
					稅金 {(Number(localExpense) - Number(localExpense) * discount * 0.01) * tax * 0.01}{' '}
					含稅後總金額{' '}
					{Number(localExpense) -
						Number(localExpense) * discount * 0.01 +
						(Number(localExpense) - Number(localExpense) * discount * 0.01) * tax * 0.01}
				</p> */}
			</div>
		</PageTemplate>
	);
}

export { BillPage };
