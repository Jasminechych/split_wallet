import { Fragment } from 'react';
import style from 'src/components/ExpenseDistribution/ExpenseDistribution.module.scss';
// import { useState } from 'react';
// import { round } from 'src/utils/round';

function ExpenseDistribution({
	className,
	inputType,
	inputName,
	memberData,
	localExpense,
	payments,
	onPaymentsChange,
}) {
	console.log('渲染 ExpenseDistribution');

	//  計算未分配金額
	let unSettledAmount = localExpense;
	let sum = 0;

	if (payments && Object.keys(payments).length !== 0) {
		sum = Object.values(payments).reduce((acc, curr) => {
			return Number(acc) + Number(curr.amount);
		}, 0);

		if (sum === 0) {
			unSettledAmount = parseFloat(localExpense - sum).toFixed(2);
		} else {
			unSettledAmount = parseFloat(sum - localExpense).toFixed(2);
		}
	}

	return (
		<div className={`${className} ${style.memberList}`}>
			{memberData.map(({ memberId, memberName }) => {
				return (
					<Fragment key={memberId}>
						{/* 顯示成員名稱後輸入框 */}
						{inputType === 'radio' && (
							<div
								className={`${style.memberGroup} ${
									payments[memberId] && payments[memberId].isSelected === true ? style.selected : ''
								}`}
								key={memberId}>
								<div className={style.nameWrapper}>
									<input
										id={`${memberId}_${inputName}`}
										type={inputType}
										name={inputName}
										onChange={() => onPaymentsChange(memberId, localExpense, inputType)}
									/>
									<label htmlFor={`${memberId}_${inputName}`}>{memberName}</label>
								</div>
								<div className={style.paymentWrapper}>
									<p>$</p>
									<p className={style.numberInput} name={inputName}>
										{payments[memberId] && payments[memberId].isSelected === true
											? payments[memberId].amount
											: '0.00'}
									</p>
								</div>
							</div>
						)}
						{(inputName === 'multiplePayer' || inputName === 'exactSplit') && (
							<div
								className={`${style.memberGroup} ${
									payments[memberId] && payments[memberId].isSelected === true ? style.selected : ''
								}`}
								key={memberId}>
								<div className={style.nameWrapper}>
									<input id={`${memberId}_${inputName}`} type={inputType} name={inputName} />
									<label htmlFor={`${memberId}_${inputName}`}>{memberName}</label>
								</div>
								<div className={style.paymentWrapper}>
									<p>$</p>
									<input
										className={style.numberInput}
										type='number'
										name={inputName}
										placeholder='0.00'
										onChange={(e) => onPaymentsChange(memberId, e.target.value, inputType)}
									/>
								</div>
							</div>
						)}
						{inputName === 'equalSplit' && (
							<div
								className={`${style.memberGroup} ${
									payments[memberId] && payments[memberId].isSelected === true ? style.selected : ''
								}`}
								key={memberId}>
								<div className={style.nameWrapper}>
									<input
										id={`${memberId}_${inputName}`}
										type={inputType}
										name={inputName}
										onClick={() => onPaymentsChange(memberId, localExpense, 'equalSplit')}
									/>
									<label htmlFor={`${memberId}_${inputName}`}>{memberName}</label>
								</div>
								<div className={style.paymentWrapper}>
									<p>$</p>
									<p className={style.numberInput}>
										{payments[memberId] && payments[memberId].isSelected === true
											? payments[memberId].amount
											: '0.00'}
									</p>
								</div>
							</div>
						)}
					</Fragment>
				);
			})}
			{/* 顯示未非配金額狀態 */}
			{parseFloat(unSettledAmount) !== 0 && unSettledAmount !== '' && (
				<p className={style.unsettled}>
					{sum > localExpense ? '超付金額' : '未分配金額'} {unSettledAmount}
				</p>
			)}
		</div>
	);
}

export { ExpenseDistribution };
