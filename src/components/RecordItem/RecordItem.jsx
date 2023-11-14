import style from 'src/components/RecordItem/RecordItem.module.scss';
import { useState } from 'react';
import { Edit, Delete, More } from 'src/assets/icons';

function RecordItem({ id, title, date, handleUpdateRecord, handleDeleteRecord }) {
	const [isEllipsisClick, setIsEllipsisClick] = useState(false);

	function handleEllipsisClick() {
		setIsEllipsisClick(!isEllipsisClick);
	}
	return (
		<div className={style.recordItem} id={id}>
			<div className={style.itemGroup}>
				<p className={style.itemTitle}>{title}</p>
				<p className={style.itemDate}>{date}</p>
				<div className={style.itemIcons}>
					{isEllipsisClick && <Edit onClick={() => handleUpdateRecord(id)} />}
					{isEllipsisClick && <Delete onClick={() => handleDeleteRecord(id)} />}
					<More onClick={handleEllipsisClick} />
				</div>
			</div>
		</div>
	);
}

export { RecordItem };
