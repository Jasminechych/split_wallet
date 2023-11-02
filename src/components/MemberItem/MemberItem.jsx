import style from 'src/components/MemberItem/MemberItem.module.scss';
import { Close } from 'src/assets/icons';

function MemberItem({ memberName, onClick }) {
	return (
		<div className={style.itemGroup} id={memberName}>
			<p>{memberName}</p>
			{/* <div className={style.itemIcons}> */}
			<Close cursor='pointer' onClick={() => onClick(memberName)} />
			{/* </div> */}
		</div>
	);
}

export { MemberItem };
