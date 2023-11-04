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
	error,
}) {
	// console.log('渲染 ExpenseDistribution');

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
						{(inputName === 'singlePayer' || inputName === 'equalSplit') && (
							<div key={memberId}>
								<label
									htmlFor={`${memberId}_${inputName}`}
									className={`${style.memberGroup} ${
										payments[memberId] && payments[memberId].isSelected === true
											? style.selected
											: ''
									}`}>
									<div className={style.nameWrapper}>
										<input
											id={`${memberId}_${inputName}`}
											type={inputType}
											name={inputName}
											onChange={() => onPaymentsChange(memberId, localExpense, inputName)}
										/>
										{memberName}
									</div>
									<div className={style.paymentWrapper}>
										<p>$</p>
										<p className={style.numberInput}>
											{payments[memberId] && payments[memberId].isSelected === true
												? payments[memberId].amount
												: '0'}
										</p>
									</div>
								</label>
							</div>
						)}
						{(inputName === 'multiplePayer' || inputName === 'exactSplit') && (
							<div
								key={memberId}
								className={`${style.memberGroup} ${
									payments[memberId] && payments[memberId].isSelected === true ? style.selected : ''
								}`}>
								<div className={style.nameWrapper}>
									<p>{memberName}</p>
								</div>
								<div className={style.paymentWrapper}>
									<p>$</p>
									<input
										className={style.numberInput}
										type='number'
										name={inputName}
										placeholder='0'
										onChange={(e) => onPaymentsChange(memberId, e.target.value, inputType)}
									/>
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
			<p className={style.errorMessage}>{error ? error : ''}</p>
		</div>
	);
}

export { ExpenseDistribution };
