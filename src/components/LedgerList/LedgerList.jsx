import style from 'src/components/LedgerList/LedgerList.module.scss';
import { v4 as uuidv4 } from 'uuid';

function LedgerList({ data = [] }) {
	return (
		<div className={style.ledgerList}>
			{data.length > 0 ? (
				data.map((item) => {
					return (
						<div className={style.ledgerItem} key={uuidv4()}>
							<p className={style.ledgerItemDebtor}>{item.debtor}</p>
							<p className={style.ledgerItemOwe}>需支付</p>
							<p className={style.ledgerItemCreditor}>{item.creditor}</p>
							<p className={style.ledgerItemAmount}>{item.amount}</p>
							<p className={style.ledgerItemCurrency}>{item.currency}</p>
						</div>
					);
				})
			) : (
				<h4 className={style.emptyContent}>。。。 尚無需進行費用分擔的情況 。。。</h4>
			)}
		</div>
	);
}

export { LedgerList };
