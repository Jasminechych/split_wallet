import style from 'src/components/RecordList/RecordList.module.scss';
import { RecordItem } from 'src/components/RecordItem/RecordItem';

function RecordList({ data = [], handleDeleteRecord }) {
	return (
		<div className={style.expensesList}>
			{data.length > 0 ? (
				data.map((item) => (
					<RecordItem
						key={item.id}
						id={item.id}
						title={item.billTitle}
						date={item.billDate}
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
