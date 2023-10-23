import style from 'src/components/MemberItem/MemberItem.module.scss';
import { Close } from 'src/assets/icons';

function MemberItem({ memberName, onClick }) {
	return (
		<div className={style.itemGroup} id={memberName}>
			<h5>{memberName}</h5>
			<div className={style.itemIcons}>
				<Close onClick={() => onClick(memberName)} />
			</div>
		</div>
	);
}

export { MemberItem };
