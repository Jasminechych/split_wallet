import style from 'src/components/RecordItem/RecordItem.module.scss';
import { useState } from 'react';
import { Edit, Delete, More } from 'src/assets/icons';

function RecordItem({ id, title, date, handleUpdateRecord, handleDeleteRecord }) {
	const [isEllipsisClick, setIsEllipsisClick] = useState(false);

	function handleEllipsisClick() {
		setIsEllipsisClick(!isEllipsisClick);
	}
	return (
		<div className={style.recordItemGroup} id={id}>
			<p className={style.recordItemTitle}>{title}</p>
			<p className={style.recordItemDate}>{date}</p>
			<div className={style.recordItemIcons}>
				{isEllipsisClick && <Edit onClick={() => handleUpdateRecord(id)} />}
				{isEllipsisClick && <Delete onClick={() => handleDeleteRecord(id)} />}
				<More onClick={handleEllipsisClick} />
			</div>
		</div>
	);
}

export { RecordItem };
