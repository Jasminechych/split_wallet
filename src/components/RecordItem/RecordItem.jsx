import style from 'src/components/RecordItem/RecordItem.module.scss';
import { useState } from 'react';
import { More, Edit, Delete } from 'src/assets/icons';

function RecordItem({ id, title, date, handleDeleteRecord }) {
	const [isEllipsisClick, setIsEllipsisClick] = useState(false);

	function handleEllipsisClick() {
		setIsEllipsisClick(!isEllipsisClick);
	}
	return (
		<div className={style.itemGroup} id={id}>
			<p className={style.itemTitle}>{title}</p>
			<p className={style.itemDate}>{date}</p>
			<div className={style.itemIcons}>
				{isEllipsisClick && <Edit />}
				{isEllipsisClick && <Delete onClick={() => handleDeleteRecord(id)} />}
				<More onClick={handleEllipsisClick} />
			</div>
		</div>
	);
}

export { RecordItem };
