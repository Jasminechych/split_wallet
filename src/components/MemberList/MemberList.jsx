import style from 'src/components/MemberList/MemberList.module.scss';
import { MemberItem } from 'src/components/MemberItem/MemberItem';

function MemberList({ groupMembersInfo, onClick }) {
	return (
		<div className={style.memberList}>
			{groupMembersInfo.map((member) => {
				return <MemberItem key={member} memberName={member} onClick={onClick} />;
			})}
		</div>
	);
}

export { MemberList };
