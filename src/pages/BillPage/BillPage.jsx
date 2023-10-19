import style from 'src/pages/BillPage/BillPage.module.scss';
import { useState, useRef } from 'react';
import { Input } from 'src/components/Input/Input';
import { Select } from 'src/components/Select/Select';
import { Button } from 'src/components/Button/Button';
import { ExpenseDistribution } from 'src/components/ExpenseDistribution/ExpenseDistribution';
import { round } from 'src/utils/round';

const memberData = [
	{ memberId: '1', memberName: 'AnnaGGGG' },
	{ memberId: '2', memberName: 'Tim' },
	{ memberId: '3', memberName: 'Bill' },
];

function BillPage() {
	const [billDate, setBillDate] = useState('');
	const [billTitle, setBillTitle] = useState('');
	const [localExpense, setLocalExpense] = useState('');
	const [actualExpense, setActualExpense] = useState('');
	const [rate, setRate] = useState('');
	const [payer, setPayer] = useState('單人付款');
	const [split, setSplit] = useState('平均分攤');
	const [payerPayments, setPayerPayments] = useState({});
	const [splitPayments, setSplitPayments] = useState({});

	const selectedMemberRef = useRef({});

	console.log('渲染 BillPage');

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
	}

	function handleLocalExpenseChange(value) {
		setLocalExpense(value);

		// 如果 splitPayments 裡面有資料，代表使用者已點選過要分帳的成員，當 localExpense 有更新時應該要一併更新 splitPayments 裡面的金額，
		// 以確保畫面顯示及 splitPayments 的資料是正確同步更新的。
		if (splitPayments !== null && splitPayments !== undefined) {
			const selectedMemberCount = Object.values(selectedMemberRef.current).filter(
				(item) => item === true,
			).length;

			Object.entries(splitPayments).forEach(([id, item]) => {
				if (item.isSelected === true) {
					setSplitPayments((prev) => ({
						...prev,
						[id]: {
							amount: round(value / selectedMemberCount, 2),
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
							: (Number(splitAmount) + Number(remainderAmount)).toFixed(2), // 如果平均分配除不盡的話將餘額分配給最後一個人
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

	// 測試結果用
	function handleButtonClick() {
		console.log('payerPayments', payerPayments);
		console.log('splitPayments', splitPayments);
	}

	return (
		<div className={style.page}>
			<h2 className={style.pageTitle}>新增消費</h2>
			<form className={style.pageForm}>
				<Input
					groupTitle='消費日期'
					type='date'
					value={billDate}
					onChange={(e) => handleBillDateChange(e.target.value)}
				/>
				<Input
					groupTitle='品項'
					type='text'
					placeholder='請輸入品項'
					value={billTitle}
					onChange={(e) => handleBillTitleChange(e.target.value)}
				/>
				<Input
					groupTitle='當地消費金額'
					type='number'
					placeholder='請輸入當地消費金額'
					value={localExpense}
					onChange={(e) => handleLocalExpenseChange(e.target.value)}
				/>
				<Input
					groupTitle='實際金額 (與匯率擇一填寫)'
					type='number'
					placeholder='請輸入實際金額'
					value={actualExpense}
					onChange={(e) => handleActualExpenseChange(e.target.value)}
				/>
				<Input
					groupTitle='匯率 (與實際金額擇一填寫)'
					type='number'
					placeholder='請輸入匯率'
					value={rate}
					onChange={(e) => handleRateChange(e.target.value)}
				/>
				<span>
					<Select
						selectTitle='誰付錢'
						optionsData={[
							{ type: 'single', title: '單人付款' },
							{ type: 'multiple', title: '多人付款' },
						]}
						value={payer}
						onChange={(e) => handlePayerChange(e.target.value)}
					/>
					{payer === '單人付款' && (
						<ExpenseDistribution
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
							inputType='checkbox'
							inputName='multiplePayer'
							memberData={memberData}
							localExpense={localExpense}
							payer='multiple'
							payments={payerPayments}
							onPaymentsChange={handlePayerPaymentChange}
						/>
					)}
				</span>
				<span>
					<Select
						selectTitle='分給誰'
						optionsData={[
							{ type: 'equal', title: '平均分攤' },
							{ type: 'exact', title: '各付各的' },
						]}
						value={split}
						onChange={(e) => handleSplitChange(e.target.value)}
					/>
					{split === '平均分攤' && (
						<ExpenseDistribution
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
							inputType='checkbox'
							inputName='exactSplit'
							memberData={memberData}
							localExpense={localExpense}
							payments={splitPayments}
							onPaymentsChange={handleSplitPaymentChange}
						/>
					)}
				</span>
			</form>
			<Button className={style.pageButton} text='新增' onClick={handleButtonClick} />
		</div>
	);
}

export { BillPage };
