import style from 'src/components/MemberList/MemberList.module.scss';
import { MemberItem } from 'src/components/MemberItem/MemberItem';

function MemberList({ groupMembersList, onClick }) {
	return (
		<div className={style.memberList}>
			{groupMembersList.map((member) => {
				return (
					<MemberItem key={member.memberId} memberName={member.memberName} onClick={onClick} />
				);
			})}
		</div>
	);
}

export { MemberList };
