import { useState } from 'react';
import { PageTemplate } from 'src/pages/PageTemplate/PageTemplate';

import { Input } from 'src/components/Input/Input';
import { MemberList } from 'src/components/MemberList/MemberList';
import { Add } from 'src/assets/icons';
import { Select } from 'src/components/Select/Select';
import currencyData from 'src/assets/currencyData.json';

function SetupPage() {
	const [groupName, setGroupName] = useState('');
	const [groupMember, setGroupMember] = useState('');
	const [groupMembersInfo, setGroupMembersInfo] = useState([]);
	const [localExpenseCurrency, setLocalExpenseCurrency] = useState('TWD');
	const [actualExpenseCurrency, setActualExpenseCurrency] = useState('TWD');

	function handleGroupNameChange(e) {
		setGroupName(e);
	}

	function handleGroupMemberChange(e) {
		setGroupMember(e);
	}

	function handleAddClick(groupMember) {
		if (!groupMember.trim().length) return;
		setGroupMembersInfo((prev) => [groupMember, ...prev]);
		setGroupMember('');
	}

	function handleLocalExpenseCurrencyChange(value) {
		setLocalExpenseCurrency(value);
	}

	function handleActualExpenseCurrencyChange(value) {
		setActualExpenseCurrency(value);
	}

	function handleDeleteMember(id) {
		setGroupMembersInfo((prev) => {
			return prev.filter((member) => {
				return member !== id;
			});
		});
	}

	function handleSubmit() {
		console.log({
			groupName: groupName,
			groupMembersInfo: groupMembersInfo,
			localExpenseCurrency: localExpenseCurrency,
			actualExpenseCurrency: actualExpenseCurrency,
		});
	}

	return (
		<PageTemplate pageTitle='建立群組' pageButtonTitle='建立群組' onClick={handleSubmit}>
			<Input
				title='群組名稱'
				type='text'
				placeholder='請輸入群組名稱'
				value={groupName}
				onChange={(e) => handleGroupNameChange(e.target.value)}
			/>
			<Select
				title='當地消費貨幣'
				optionsData={currencyData}
				value={localExpenseCurrency}
				onChange={(e) => handleLocalExpenseCurrencyChange(e.target.value)}
			/>
			<Select
				title='實際帳單貨幣'
				optionsData={currencyData}
				value={actualExpenseCurrency}
				onChange={(e) => handleActualExpenseCurrencyChange(e.target.value)}
			/>
			<Input
				title='群組成員'
				type='text'
				placeholder='請輸入群組成員'
				value={groupMember}
				onChange={(e) => handleGroupMemberChange(e.target.value)}
				suffix={<Add cursor='pointer' onClick={() => handleAddClick(groupMember)} />}
			/>
			<MemberList
				groupMembersInfo={groupMembersInfo}
				onClick={(member) => handleDeleteMember(member)}
			/>
		</PageTemplate>
	);
}

export { SetupPage };
