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
import Swal from 'sweetalert2';
import { useGroupInfo } from 'src/contexts/GroupInfoContext';

function SetupPage() {
	const [groupMember, setGroupMember] = useState('');

	// react-router-dom
	const navigate = useNavigate();

	// hook
	const { errors, handleErrors, clearErrors } = useErrorHandling();

	// context
	const { groupData, setGroupData } = useGroupInfo();

	function handleGroupNameChange(value) {
		setGroupData((prev) => ({
			...prev,
			groupName: value,
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
		if (groupData.groupMembersList.some((member) => member.memberName.trim() === value.trim())) {
			handleErrors('groupMember', '請輸入非重複的成員名稱');
			return;
		}

		setGroupData((prev) => ({
			...prev,
			groupMembersList: [{ memberId: uuidv4(), memberName: value }, ...prev.groupMembersList],
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

		if (groupData.groupMembersList.length < 2) {
			handleErrors('groupMember', '請至少輸入兩位群組成員');
		}

		if (
			groupData.groupName === '' ||
			groupData.groupName.length > 20 ||
			groupData.groupMembersList.length < 2
		)
			return;

		// 建立群組
		const { successAddGroup, groupId } = await addGroup(groupData);

		if (successAddGroup) {
			Swal.fire({
				position: 'center',
				icon: 'success',
				title: '建立成功',
				text: '知道此連結的使用者皆可以存取群組資料 請妥善保存',
				confirmButtonText: '儲存連結',
			}).then((result) => {
				if (result.isConfirmed) {
					navigator.clipboard.writeText(`${process.env.REACT_APP_PUBLIC_URL}/record/${groupId}`);
					Swal.fire('已複製連結!', '', 'success');
				}
			});

			navigate(`/bill/${groupId}`);
		} else {
			Swal.fire({
				position: 'center',
				icon: 'error',
				title: '建立失敗，請稍後再試',
				showConfirmButton: false,
				timer: 1000,
			});
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
