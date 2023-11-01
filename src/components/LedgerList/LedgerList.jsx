import style from 'src/components/LedgerList/LedgerList.module.scss';

function LedgerList() {
	return (
		<div className={style.ledgerList}>
			<div className={style.ledgerItem}>
				<p>Banana</p>
				<p>欠</p>
				<p>Orange</p>
				<p>$500</p>
			</div>
			<div className={style.ledgerItem}>
				<p>Banana</p>
				<p>欠</p>
				<p>Orange</p>
				<p>$500</p>
			</div>
			<div className={style.ledgerItem}>
				<p>Banana</p>
				<p>欠</p>
				<p>Orange</p>
				<p>$500</p>
			</div>
		</div>
	);
}

export { LedgerList };
