import { MemberItem } from 'src/components/MemberItem/MemberItem';

function MemberList({ className, groupMembersInfo }) {
	return (
		<div className={className}>
			{groupMembersInfo.map((member) => {
				return <MemberItem key={member} memberName={member} />;
			})}
		</div>
	);
}

export { MemberList };
