import style from 'src/components/LedgerList/LedgerList.module.scss';
import { v4 as uuidv4 } from 'uuid';

function LedgerList({ data = [] }) {
	return (
		<div className={style.ledgerList}>
			{data.length > 0 ? (
				data.map((item) => {
					return (
						<div className={style.ledgerItem} key={uuidv4()}>
							<div className={style.ledgerItemPersonWrapper}>
								<p className={style.ledgerItemDebtor}>{item.debtor}</p>
								<p className={style.ledgerItemOwe}>需支付</p>
								<p className={style.ledgerItemCreditor}>{item.creditor}</p>
							</div>
							<div className={style.ledgerItemAmountWrapper}>
								<p className={style.ledgerItemAmount}>{item.amount}</p>
								<p className={style.ledgerItemCurrency}>{item.currency}</p>
							</div>
						</div>
					);
				})
			) : (
				<h4 className={style.emptyContent}>。。。 還沒有債務紀錄喔 。。。</h4>
			)}
		</div>
	);
}

export { LedgerList };
