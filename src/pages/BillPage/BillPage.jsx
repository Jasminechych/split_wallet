import style from 'src/pages/BillPage/BillPage.module.scss';
import { useState, useRef, useEffect } from 'react';
import { PageTemplate } from 'src/pages/PageTemplate/PageTemplate';
import { Input } from 'src/components/Input/Input';
import { Select } from 'src/components/Select/Select';
import { ExpenseDistribution } from 'src/components/ExpenseDistribution/ExpenseDistribution';
import { round } from 'src/libraries/utils/round';
import { checkValidNumberInput } from 'src/libraries/utils/checkValidNumberInput';
import { useErrorHandling } from 'src/libraries/hooks/useErrorHandling';
import currencyData from 'src/assets/currencyData.json';
import { useNavigate, useParams } from 'react-router-dom';
import { Loading } from 'src/assets/icons';
import Swal from 'sweetalert2';
import { useGroupInfo } from 'src/contexts/GroupInfoContext';
import { getBill } from 'src/apis/apis';
import { getRate } from 'src/apis/rate_api';

const payerOptionsData = [
	{ key: 'single', value: '單人付款' },
	{ key: 'multiple', value: '多人付款' },
];

const splitOptionsData = [
	{ key: 'equal', value: '平均分攤' },
	{ key: 'exact', value: '各付各的' },
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
		payer: '',
		split: '',
		payerPayments: {},
		splitPayments: {},
	});

	const [memberData, setMemberData] = useState([]);
	const [file, setFile] = useState(null);

	// const previewUrl = file
	// 	? file : URL.createObjectURL(file) ?
	// 	: 'https://react.semantic-ui.com/images/wireframe/image.png';
	const previewUrl =
		file && typeof file === 'string'
			? file
			: (file instanceof File && URL.createObjectURL(file)) ||
			  'https://react.semantic-ui.com/images/wireframe/image.png';

	// 紀錄當前 選到的 payer & split members
	const selectedSplitMemberRef = useRef([]);
	const selectedPayerMemberRef = useRef('');

	// react-router-dom
	const navigate = useNavigate();
	const { groupId, billId } = useParams();

	// hook
	const { errors, handleErrors, clearErrors } = useErrorHandling();

	// context
	const {
		groupIdentification,
		handleGroupIdentificationChange,
		groupData,
		isLoading,
		setIsLoading,
		createBill,
		updateBillData,
	} = useGroupInfo();

	useEffect(() => {
		if (groupIdentification !== groupId) {
			handleGroupIdentificationChange(groupId);
		}

		setMemberData(groupData.groupMembersList);

		if (billId && groupIdentification) {
			const fetchBill = async () => {
				setIsLoading(true);

				const { successGetBill, data } = await getBill(groupIdentification, billId);
				if (successGetBill) {
					setBillData((prev) => ({
						...prev,
						billDate: data.billDate,
						billTitle: data.billTitle,
						localExpense: data.localExpense,
						localExpenseCurrency: data.localExpenseCurrency,
						actualExpense: data.actualExpense,
						actualExpenseCurrency: data.actualExpenseCurrency,
						rate: data.rate,
						payer: data.payer,
						split: data.split,
						payerPayments: data.payerPayments,
						splitPayments: data.splitPayments,
					}));
					setFile(data.imageUrl);

					selectedSplitMemberRef.current = Object.keys(data.splitPayments).filter(
						(key) => data.splitPayments[key].isSelected,
					);

					selectedPayerMemberRef.current = Object.keys(data.payerPayments).find(
						(key) => data.payerPayments[key].isSelected,
					);
				} else {
					Swal.fire({
						position: 'center',
						icon: 'error',
						title: '讀取資料失敗，請稍後再試',
						showConfirmButton: false,
						timer: 1000,
					});
				}

				setIsLoading(false);
			};

			fetchBill();

			return;
		}

		const initializedDistribution = groupData.groupMembersList.reduce((acc, member) => {
			acc[member.memberId] = { amount: '0.00', isSelected: false };
			return acc;
		}, {});

		setBillData((prev) => ({
			...prev,
			billDate: '',
			billTitle: '',
			localExpense: '',
			localExpenseCurrency: groupData.localExpenseCurrency,
			actualExpense: '',
			actualExpenseCurrency: groupData.actualExpenseCurrency,
			rate: '',
			payer: '單人付款',
			split: '平均分攤',
			payerPayments: initializedDistribution,
			splitPayments: initializedDistribution,
		}));
	}, [groupId, billId, groupData]);

	//  payerPayments 計算未分配金額
	const payerPaymentsUnSettledAmount = calculateUnSettledAmount(billData.payerPayments);
	//  splitPayments 計算未分配金額
	const splitPaymentsUnSettledAmount = calculateUnSettledAmount(billData.splitPayments);

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

		if (value.length > 25) {
			handleErrors('billTitle', '請勿超過25字');
			return;
		}

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
		if (billData.payer === '單人付款') {
			updateEqualSplitOrSinglePayerData('payerPayments', value, 'singlePayer');
		}

		// 對 rate 的更新
		if (Number(billData.actualExpense) !== 0) {
			calculateRate(value, billData.actualExpense);
			// 清除錯誤訊息
			clearErrors('rate');
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
		if (Number(billData.localExpense) !== 0) {
			calculateRate(billData.localExpense, value);
			// 清除錯誤訊息
			clearErrors('rate');
		}
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
		if (Number(billData.localExpense) !== 0 && Number(value) !== 0) {
			setBillData((prev) => ({
				...prev,
				actualExpense: round(Number(billData.localExpense) * Number(value), 2),
			}));

			// 清除錯誤訊息
			clearErrors('actualExpense');
		}
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

		// 清除已選中的成員
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

		// 清除已選中的成員
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

	async function handleButtonClick(action) {
		if (!checkIsValidInputAndErrorsHandler()) return;

		// 新增資料
		if (action === 'add') {
			const success = await createBill(groupIdentification, billData, file);

			if (success) {
				Swal.fire({
					position: 'center',
					icon: 'success',
					title: '新增資料成功',
					showConfirmButton: false,
					timer: 1000,
				});
				setIsLoading(false);
				navigate(`/record/${groupIdentification}`);
			} else {
				Swal.fire({
					position: 'center',
					icon: 'error',
					title: '新增資料失敗，請稍後再試',
					showConfirmButton: false,
					timer: 1000,
				});
				setIsLoading(false);
				navigate(`/record/${groupIdentification}`);
			}
			return;
		}

		// 更新資料
		if (action === 'update') {
			const { success } = await updateBillData(groupIdentification, billId, billData, file);

			if (success) {
				Swal.fire({
					position: 'center',
					icon: 'success',
					title: '更新資料成功',
					showConfirmButton: false,
					timer: 1000,
				});
				navigate(`/record/${groupIdentification}`);
			} else {
				Swal.fire({
					position: 'center',
					icon: 'error',
					title: '更新資料失敗，請稍後再試',
					showConfirmButton: false,
					timer: 1000,
				});
				navigate(`/record/${groupIdentification}`);
			}
			return;
		}
	}

	function handleFileChange(value) {
		setFile(value);
	}

	function calculateUnSettledAmount(data) {
		let unSettled = Number(billData.localExpense);
		let sum = 0;

		sum = Object.values(data).reduce((acc, curr) => {
			return Number(acc) + Number(curr.amount);
		}, 0);

		unSettled = round(sum - unSettled, 2);

		return unSettled;
	}

	function calculateRate(inputDividend, inputDivisor) {
		const dividend = Number(inputDividend);
		const divisor = Number(inputDivisor);

		if (dividend === 0 || divisor === 0) {
			setBillData((prev) => ({
				...prev,
				rate: '',
			}));
		} else {
			setBillData((prev) => ({
				...prev,
				rate: round(dividend / divisor, 3),
			}));

			// 清除錯誤訊息
			clearErrors('rate');
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

	function checkIsValidInputAndErrorsHandler() {
		if (billData.billDate === '') {
			handleErrors('billDate', '請選擇消費日期');
		}

		if (billData.billTitle.trim() === '') {
			handleErrors('billTitle', '消費品項不得為空白');
		}

		if (billData.billTitle.length > 25) {
			handleErrors('billTitle', '消費品項不得超過 25 字');
		}

		if (Number(billData.localExpense) <= 0) {
			handleErrors('localExpense', '當地消費金額不得小於 0');
		}

		if (Number(billData.actualExpense) <= 0) {
			handleErrors('actualExpense', '實際帳單金額不得小於 0');
		}

		if (Number(billData.rate) <= 0) {
			handleErrors('rate', '匯率不得小於 0');
		}

		if (Number(payerPaymentsUnSettledAmount) !== 0) {
			handleErrors('payerPayments', '請分配帳款');
		}

		if (Number(splitPaymentsUnSettledAmount) !== 0) {
			handleErrors('splitPayments', '請分配帳款');
		}

		const invalidInputs =
			billData.billDate === '' ||
			billData.billTitle.trim() === '' ||
			billData.billTitle.length > 25 ||
			Number(billData.localExpense) <= 0 ||
			Number(billData.actualExpense) <= 0 ||
			Number(billData.rate) <= 0 ||
			Number(payerPaymentsUnSettledAmount) !== 0 ||
			Number(splitPaymentsUnSettledAmount) !== 0;

		if (invalidInputs) return false;

		return true;
	}

	async function handleGetRateClick(baseCurrency) {
		try {
			const response = await getRate(baseCurrency);
			const requiredCurrency = billData.actualExpenseCurrency;
			const rate = response[requiredCurrency];
			handleRateChange(rate);
		} catch {
			Swal.fire({
				position: 'center',
				icon: 'error',
				title: '取得匯率失敗，請稍後再試',
				showConfirmButton: false,
				timer: 1000,
			});
		}
	}

	return (
		<PageTemplate
			pageTitle={billId ? '修改消費' : '新增消費'}
			pageButtonTitle={billId ? '儲存' : '新增'}
			onClick={billId ? () => handleButtonClick('update') : () => handleButtonClick('add')}>
			{isLoading ? (
				<Loading />
			) : (
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
						maxlength='25'
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
						placeholder='請輸入匯率或點擊取得匯率'
						value={billData.rate}
						onChange={(e) => handleRateChange(e.target.value)}
						error={errors.rate}
						suffix={
							<button
								className={style.suffixButton}
								onClick={() => handleGetRateClick(billData.localExpenseCurrency)}>
								取得匯率
							</button>
						}
					/>

					<Select
						className={style.payer}
						title='誰付錢'
						optionsData={payerOptionsData}
						value={billData.payer}
						onChange={(e) => handlePayerChange(e.target.value)}>
						<ExpenseDistribution
							className={style.expenseDistributionForPayer}
							inputType={billData.payer === '單人付款' ? 'radio' : ''}
							inputName={billData.payer === '單人付款' ? 'singlePayer' : 'multiplePayer'}
							memberData={memberData}
							localExpense={billData.localExpense}
							payments={billData.payerPayments}
							onPaymentsChange={handlePayerPaymentChange}
							error={errors.payerPayments}
							unSettledAmount={payerPaymentsUnSettledAmount}
						/>
					</Select>
					<Select
						className={style.split}
						title='分給誰'
						optionsData={splitOptionsData}
						value={billData.split}
						onChange={(e) => handleSplitChange(e.target.value)}>
						<ExpenseDistribution
							className={style.expenseDistributionForSplit}
							inputType={billData.split === '平均分攤' ? 'checkbox' : ''}
							inputName={billData.split === '平均分攤' ? 'equalSplit' : 'exactSplit'}
							memberData={memberData}
							localExpense={billData.localExpense}
							payments={billData.splitPayments}
							onPaymentsChange={handleSplitPaymentChange}
							error={errors.splitPayments}
							unSettledAmount={splitPaymentsUnSettledAmount}
						/>
					</Select>
					<div className={style.imageGroup}>
						<label htmlFor='billImage' className={style.imageLabel}>
							上傳圖片
							<p className={style.imageButton}>選擇檔案</p>
							<img src={previewUrl} className={style.image} />
						</label>
						<input
							id='billImage'
							type='file'
							className={style.imageInput}
							onChange={(e) => handleFileChange(e.target.files[0])}
						/>
					</div>
				</div>
			)}
		</PageTemplate>
	);
}

export { BillPage };
