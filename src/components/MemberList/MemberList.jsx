import { MemberItem } from 'src/components/MemberItem/MemberItem';

function MemberList({ className, groupMembersInfo, onClick }) {
	return (
		<div className={className}>
			{groupMembersInfo.map((member) => {
				return <MemberItem key={member} memberName={member} onClick={onClick} />;
			})}
		</div>
	);
}

export { MemberList };
