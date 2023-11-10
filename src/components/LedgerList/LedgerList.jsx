import style from 'src/components/LedgerList/LedgerList.module.scss';
import { v4 as uuidv4 } from 'uuid';

function LedgerList({ data = [] }) {
	return (
		<div className={style.ledgerList}>
			{data.length > 0 ? (
				data.map((item) => {
					return (
						<div className={style.ledgerItem} key={uuidv4()}>
							<p>{item.debtor}</p>
							<p>欠</p>
							<p>{item.creditor}</p>
							<p>{item.amount}</p>
							<p>{item.currency}</p>
						</div>
					);
				})
			) : (
				<h4 className={style.emptyContent}>。。。 還沒有任何紀錄喔 。。。</h4>
			)}
		</div>
	);
}

export { LedgerList };
