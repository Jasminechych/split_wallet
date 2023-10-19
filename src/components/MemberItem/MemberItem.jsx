import style from 'src/components/MemberItem/MemberItem.module.scss';
import { Ellipsis, Edit, Delete } from 'src/assets/icons';
import { useState } from 'react';

function MemberItem({ memberName }) {
	const [isEllipsisClick, setIsEllipsisClick] = useState(false);

	function handleEllipsisClick() {
		setIsEllipsisClick(!isEllipsisClick);
	}

	return (
		<div className={style.itemGroup}>
			<h4>{memberName}</h4>
			<div className={style.itemIcons}>
				{isEllipsisClick && <Edit />}
				{isEllipsisClick && <Delete />}
				<Ellipsis onClick={handleEllipsisClick} />
			</div>
		</div>
	);
}

export { MemberItem };
