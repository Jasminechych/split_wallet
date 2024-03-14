import style from 'src/components/RecordItem/RecordItem.module.scss';
import { useState } from 'react';
import { Edit, Delete, More } from 'src/assets/icons';
import { useGroupInfo } from 'src/contexts/GroupInfoContext';

function RecordItem({
	id,
	title,
	date,
	actualExpense,
	actualExpenseCurrency,
	localExpense,
	localExpenseCurrency,
	payerPayments,
	splitPayments,
	rate,
	image,
	handleUpdateRecord,
	handleDeleteRecord,
}) {
	const [isEllipsisClick, setIsEllipsisClick] = useState(false);

	const { groupData } = useGroupInfo();

	function handleEllipsisClick() {
		setIsEllipsisClick(!isEllipsisClick);
	}

	// 將 id 轉成姓名
	function mapMemberIdToName(membersData, memberId) {
		const member = membersData.find((member) => member.memberId === memberId);
		return member ? member.memberName : memberId;
	}

	const creditor = Object.keys(payerPayments)
		.filter((key) => parseFloat(payerPayments[key].amount) > 0)
		.map((id) => ({
			id: mapMemberIdToName(groupData.groupMembersList, id),
			amount: payerPayments[id].amount,
		}))
		.sort((a, b) => a.id - b.id);

	const debtor = Object.keys(splitPayments)
		.filter((key) => parseFloat(splitPayments[key].amount) > 0)
		.map((id) => ({
			id: mapMemberIdToName(groupData.groupMembersList, id),
			amount: splitPayments[id].amount,
		}))
		.sort((a, b) => a.id - b.id);

	return (
		<div className={style.recordItemGroup} id={id}>
			<p className={style.recordItemTitle}>{title}</p>
			<p className={style.recordItemDate}>{date}</p>
			<div className={style.recordItemIcons}>
				{isEllipsisClick && <Edit onClick={() => handleUpdateRecord(id)} />}
				{isEllipsisClick && <Delete onClick={() => handleDeleteRecord(id)} />}
				<More onClick={handleEllipsisClick} />
			</div>
			{isEllipsisClick && (
				<div className={style.recordItemDetailGroup}>
					<p className={style.recordItemDetail}>
						當地消費金額： {localExpense} {localExpenseCurrency}
					</p>
					<p className={style.recordItemDetail}>
						實際帳單金額： {actualExpense} {actualExpenseCurrency}
					</p>
					<p className={style.recordItemDetail}>匯率： {rate}</p>
					<p className={style.recordItemDetail}>付款人： </p>
					{creditor.map((item) => (
						<p className={style.recordItemDetail} key={item.id}>
							{item.id} {item.amount} {localExpenseCurrency}
						</p>
					))}
					<p className={style.recordItemDetail}>分帳人： </p>
					{debtor.map((item) => (
						<p className={style.recordItemDetail} key={item.id}>
							{item.id} {item.amount} {localExpenseCurrency}
						</p>
					))}
					<img className={style.recordItemImage} src={image} />
				</div>
			)}
		</div>
	);
}

export { RecordItem };
