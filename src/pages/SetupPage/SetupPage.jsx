import style from 'src/pages/SetupPage/SetupPage.module.scss';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'src/components/Button/Button';
import { Input } from 'src/components/Input/Input';
import { MemberList } from 'src/components/MemberList/MemberList';
import { Add } from 'src/assets/icons';
import { Select } from 'src/components/Select/Select';
import { useErrorHandling } from 'src/libraries/hooks/useErrorHandling';
import currencyData from 'src/assets/currencyData.json';
import { v4 as uuidv4 } from 'uuid';
import { addGroup } from 'src/apis/apis';

function SetupPage() {
	const [groupData, setGroupData] = useState({
		groupName: '',
		groupMembersList: [],
		localExpenseCurrency: 'TWD',
		actualExpenseCurrency: 'TWD',
	});
	const [groupMember, setGroupMember] = useState('');

	// react-router-dom
	const navigate = useNavigate();

	// hook
	const { errors, handleErrors, clearErrors } = useErrorHandling();

	function handleGroupNameChange(value) {
		setGroupData((prev) => ({
			...prev,
			groupName: value.trim(),
		}));

		// 清除錯誤訊息
		clearErrors('groupName');
	}

	function handleLocalExpenseCurrencyChange(value) {
		setGroupData((prev) => ({
			...prev,
			localExpenseCurrency: value,
		}));
	}

	function handleActualExpenseCurrencyChange(value) {
		setGroupData((prev) => ({
			...prev,
			actualExpenseCurrency: value,
		}));
	}

	function handleGroupMemberChange(value) {
		setGroupMember(value);

		// 清除錯誤訊息
		clearErrors('groupMember');
	}

	function handleAddMember(value) {
		// 防止空白的成員名稱
		if (!value.trim().length) {
			handleErrors('groupMember', '群組成員名稱不得為空白');
			return;
		}

		// 防止空白的成員超過 15 字
		if (value.length > 15) {
			handleErrors('groupMember', '群組成員名稱不得超過 15 字');
			return;
		}

		// 防止重複的成員名稱
		if (groupData.groupMembersList.some((member) => member.memberName === value.trim())) {
			handleErrors('groupMember', '請輸入非重複的成員名稱');
			return;
		}

		// 去除前後空白後儲存成員
		setGroupData((prev) => ({
			...prev,
			groupMembersList: [
				{ memberId: uuidv4(), memberName: value.trim() },
				...prev.groupMembersList,
			],
		}));

		// 清除已儲存的成員名稱
		setGroupMember('');

		// 清除錯誤訊息
		clearErrors('groupMember');
	}

	function handleDeleteMember(name) {
		setGroupData((prev) => ({
			...prev,
			groupMembersList: prev.groupMembersList.filter((member) => member.memberName !== name),
		}));
	}

	async function handleSubmit() {
		// 錯誤處理
		if (!groupData.groupName.trim().length) {
			handleErrors('groupName', '群組名稱不得為空白');
		}

		if (groupData.groupName.length > 20) {
			handleErrors('groupName', '群組名稱不得超過 20 字');
		}

		if (!groupData.groupMembersList.length) {
			handleErrors('groupMember', '請至少輸入一位群組成員');
		}

		if (
			groupData.groupName === '' ||
			groupData.groupName.length > 20 ||
			!groupData.groupMembersList.length
		)
			return;

		// 建立群組
		const { successAddGroup, groupId } = await addGroup(groupData);

		if (successAddGroup) {
			navigate(`/bill/${groupId}`);
		} else {
			window.alert('建立失敗');
		}
	}

	return (
		<div className={style.page}>
			<main className={style.pageMain}>
				<h2 className={style.pageTitle}>建立群組</h2>
				<section className={style.mainSection}>
					<Input
						title='群組名稱'
						type='text'
						maxlength='20'
						placeholder='請輸入群組名稱'
						value={groupData.groupName}
						onChange={(e) => handleGroupNameChange(e.target.value)}
						error={errors.groupName}
					/>
					<Select
						title='當地消費貨幣'
						optionsData={currencyData}
						value={groupData.localExpenseCurrency}
						onChange={(e) => handleLocalExpenseCurrencyChange(e.target.value)}
						error={errors.localExpenseCurrency}
					/>
					<Select
						title='實際帳單貨幣'
						optionsData={currencyData}
						value={groupData.actualExpenseCurrency}
						onChange={(e) => handleActualExpenseCurrencyChange(e.target.value)}
						error={errors.actualExpenseCurrency}
					/>
					<Input
						title='群組成員'
						type='text'
						maxlength='15'
						placeholder='請輸入群組成員'
						value={groupMember}
						onChange={(e) => handleGroupMemberChange(e.target.value)}
						suffix={<Add cursor='pointer' onClick={() => handleAddMember(groupMember)} />}
						error={errors.groupMember}
					/>
					<MemberList
						groupMembersList={groupData.groupMembersList}
						onClick={(member) => handleDeleteMember(member)}
					/>
				</section>
				<Button className={style.pageButton} text='建立群組' onClick={handleSubmit} />
			</main>
		</div>
	);
}

export { SetupPage };
