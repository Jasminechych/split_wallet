import style from 'src/components/RecordList/RecordList.module.scss';
import { RecordItem } from 'src/components/RecordItem/RecordItem';

function RecordList({ data }) {
	return (
		<div className={style.expensesList}>
			{data.length ? (
				data.map((item) => <RecordItem key={item.id} title={item.title} date={item.date} />)
			) : (
				<h4 className={style.emptyContent}>。。。 還沒有任何紀錄喔 。。。</h4>
			)}
		</div>
	);
}

export { RecordList };
