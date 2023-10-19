import style from 'src/pages/RecordPage/RecordPage.module.scss';
import { Button } from 'src/components/Button/Button';
import { RecordList } from 'src/components/RecordList/RecordList';

function RecordPage() {
	return (
		<div className={style.page}>
			<h2 className={style.pageTitle}>消費紀錄</h2>
			<form className={style.pageForm}>
				<RecordList />
			</form>
			<Button className={style.pageButton} text='新增' />
			<Button className={style.pageButton} text='結算' />
		</div>
	);
}

export { RecordPage };
