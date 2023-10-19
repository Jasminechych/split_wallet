import style from 'src/components/RecordItem/RecordItem.module.scss';
import { useState } from 'react';
import { Ellipsis, Edit, Delete } from 'src/assets/icons';

function RecordItem({ id, title, date }) {
	const [isEllipsisClick, setIsEllipsisClick] = useState(false);

	function handleEllipsisClick() {
		setIsEllipsisClick(!isEllipsisClick);
	}
	return (
		<div className={style.itemGroup} id={id}>
			<h4 className={style.itemTitle}>{title}</h4>
			<p className={style.itemDate}>{date}</p>
			<div className={style.itemIcons}>
				{isEllipsisClick && <Edit />}
				{isEllipsisClick && <Delete />}
				<Ellipsis onClick={handleEllipsisClick} />
			</div>
		</div>
	);
}

export { RecordItem };
