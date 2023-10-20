import style from 'src/pages/SetupPage/SetupPage.module.scss';
import { useState } from 'react';
import { Input } from 'src/components/Input/Input';
import { Button } from 'src/components/Button/Button';
import { MemberList } from 'src/components/MemberList/MemberList';
import { Add } from 'src/assets/icons';

function SetupPage() {
	const [groupName, setGroupName] = useState('');
	const [groupMember, setGroupMember] = useState('');
	const [groupMembersInfo, setGroupMembersInfo] = useState([]);

	console.log(groupMembersInfo);

	function handleGroupNameChange(e) {
		setGroupName(e);
	}

	function handleGroupMemberChange(e) {
		setGroupMember(e);
	}

	function handleAddClick(groupMember) {
		if (!groupMember.trim().length) return;
		console.log('click');
		setGroupMembersInfo((prev) => [groupMember, ...prev]);
		setGroupMember('');
	}

	return (
		<div className={style.page}>
			<h2 className={style.pageTitle}>建立群組</h2>
			<form className={style.pageForm}>
				<Input
					id='groupNameId'
					groupTitle='群組名稱'
					type='text'
					placeholder='請輸入群組名稱'
					value={groupName}
					onChange={(e) => handleGroupNameChange(e.target.value)}
				/>
				<Input
					id='groupMemberId'
					groupTitle='群組成員'
					type='text'
					placeholder='請輸入群組成員'
					value={groupMember}
					onChange={(e) => handleGroupMemberChange(e.target.value)}
					suffix={<Add className={style.add} onClick={() => handleAddClick(groupMember)} />}
				/>
			</form>

			<MemberList className={style.memberGroup} groupMembersInfo={groupMembersInfo} />

			<Button className={style.pageButton} text='建立群組' />
		</div>
	);
}

export { SetupPage };
