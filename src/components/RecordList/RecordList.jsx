import style from 'src/components/RecordList/RecordList.module.scss';
import { RecordItem } from 'src/components/RecordItem/RecordItem';

function RecordList({ data = [], handleUpdateRecord, handleDeleteRecord }) {
	return (
		<div className={style.recordList}>
			{data.length > 0 ? (
				data
					.sort((a, b) => b.billDate.localeCompare(a.billDate))
					.map((item) => (
						<RecordItem
							key={item.id}
							id={item.id}
							title={item.billTitle}
							date={item.billDate}
							actualExpense={item.actualExpense}
							actualExpenseCurrency={item.actualExpenseCurrency}
							localExpense={item.localExpense}
							localExpenseCurrency={item.localExpenseCurrency}
							payerPayments={item.payerPayments}
							splitPayments={item.splitPayments}
							rate={item.rate}
							image={item.imageUrl}
							handleUpdateRecord={(id) => handleUpdateRecord(id)}
							handleDeleteRecord={(id) => handleDeleteRecord(id)}
						/>
					))
			) : (
				<h4 className={style.emptyContent}>。。。 還沒有任何紀錄喔 。。。</h4>
			)}
		</div>
	);
}

export { RecordList };
