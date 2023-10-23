import style from 'src/pages/LedgerPage/LedgerPage.module.scss';
import { Button } from 'src/components/Button/Button';

function LedgerPage() {
	return (
		<div className={style.page}>
			<h2 className={style.pageTitle}>結算</h2>
			<form className={style.pageForm}></form>
			<Button className={style.pageButton} text='新增' />
		</div>
	);
}

export { LedgerPage };
