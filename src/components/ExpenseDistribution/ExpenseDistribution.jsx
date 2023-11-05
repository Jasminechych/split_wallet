import { Fragment } from 'react';
import style from 'src/components/ExpenseDistribution/ExpenseDistribution.module.scss';

function ExpenseDistribution({
	className,
	inputType,
	inputName,
	memberData,
	localExpense,
	payments,
	onPaymentsChange,
	error,
	sum,
	unSettledAmount,
}) {
	console.log('in Ex unSettledAmount:', unSettledAmount, 'sum:', sum);
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
												: '0.00'}
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
										placeholder='0.00'
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

			{/* 錯誤提示 */}
			<p className={style.errorMessage}>{error}</p>
		</div>
	);
}

export { ExpenseDistribution };
