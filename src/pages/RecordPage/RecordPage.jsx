import { PageTemplate } from 'src/pages/PageTemplate/PageTemplate';
import { RecordList } from 'src/components/RecordList/RecordList';

function RecordPage() {
	return (
		<PageTemplate pageTitle='消費紀錄' pageButtonTitle='結算'>
			<RecordList />
			{/* <Button className={style.pageButton} text='新增' />
			<Button className={style.pageButton} text='結算' /> */}
		</PageTemplate>
	);
}

export { RecordPage };
