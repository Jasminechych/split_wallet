import style from 'src/components/RecordList/RecordList.module.scss';
import { RecordItem } from 'src/components/RecordItem/RecordItem';

const data = [
	{ id: 1, title: '早餐', date: '2023/05/12' },
	{ id: 2, title: '晚餐', date: '2023/05/12' },
];

function RecordList({ className }) {
	return (
		<section className={`${className} ${style.expensesList}`}>
			{data.length ? (
				data.map((item) => <RecordItem key={item.id} title={item.title} date={item.date} />)
			) : (
				<p>按下新增按鈕來新增一筆花費</p>
			)}
		</section>
	);
}

export { RecordList };
