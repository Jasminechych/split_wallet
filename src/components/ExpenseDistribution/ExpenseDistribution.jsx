import style from 'src/components/ExpenseDistribution/ExpenseDistribution.module.scss';

function ExpenseDistribution({
	className,
	inputType,
	inputName,
	memberData,
	payments,
	localExpense,
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
								{/* 單人付款 跟 平均分攤 名字前顯示 radio or checkbox */}
								{(inputName === '單人付款' || inputName === '平均分攤') && (
									<input
										id={`${memberId}_${inputName}`}
										type={inputType}
										checked={payments[memberId].isSelected === true ? true : false}
										onChange={() => onPaymentsChange(memberId, localExpense)}
									/>
								)}
								<p className={style.memberName}>{memberName}</p>
							</div>

							<div className={style.paymentWrapper}>
								<p>$</p>
								{/* 單人付款 跟 平均分攤 僅顯示 read only 金額 */}
								{inputName === '單人付款' || inputName === '平均分攤' ? (
									<p className={style.numberInput}>
										{payments[memberId].isSelected === true ? payments[memberId].amount : '0.00'}
									</p>
								) : (
									<input
										className={style.numberInput}
										type='number'
										placeholder='0.00'
										value={Number(payments[memberId].amount) || ''}
										onChange={(e) => onPaymentsChange(memberId, e.target.value)}
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
