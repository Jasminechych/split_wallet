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
	unSettledAmount,
}) {
	return (
		<div className={`${className} ${style.memberList}`}>
			{memberData.map(({ memberId, memberName }) => {
				return (
					<div key={memberId}>
						<label
							htmlFor={`${memberId}_${inputName}`}
							className={`${style.memberGroup} ${
								payments[memberId] && payments[memberId].isSelected === true ? style.selected : ''
							}`}>
							<div className={style.nameWrapper}>
								{(inputName === 'singlePayer' || inputName === 'equalSplit') && (
									<input
										id={`${memberId}_${inputName}`}
										type={inputType}
										name={inputName}
										onChange={() => onPaymentsChange(memberId, localExpense, inputName)}
									/>
								)}
								<p>{memberName}</p>
							</div>
							<div className={style.paymentWrapper}>
								<p>$</p>
								{inputName === 'singlePayer' || inputName === 'equalSplit' ? (
									<p className={style.numberInput}>
										{payments[memberId] && payments[memberId].isSelected === true
											? payments[memberId].amount
											: '0.00'}
									</p>
								) : (
									<input
										className={style.numberInput}
										type='number'
										name={inputName}
										placeholder='0.00'
										onChange={(e) => onPaymentsChange(memberId, e.target.value, inputType)}
									/>
								)}
							</div>
						</label>
					</div>
				);
			})}
			{/* 顯示未非配金額狀態 */}
			{parseFloat(unSettledAmount) !== 0 && (
				<p className={style.unsettled}>
					{unSettledAmount < 0 ? '未分配金額' : '超付金額'} {unSettledAmount}
				</p>
			)}

			{/* 錯誤提示 */}
			<p className={style.errorMessage}>{error}</p>
		</div>
	);
}

export { ExpenseDistribution };
