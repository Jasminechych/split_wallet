import style from 'src/pages/SetupPage/SetupPage.module.scss';
import { useState } from 'react';
import { Button } from 'src/components/Button/Button';
import { Input } from 'src/components/Input/Input';
import { MemberList } from 'src/components/MemberList/MemberList';
import { Add } from 'src/assets/icons';
import { Select } from 'src/components/Select/Select';
import currencyData from 'src/assets/currencyData.json';

function SetupPage() {
	const [groupName, setGroupName] = useState('');
	const [groupMember, setGroupMember] = useState('');
	const [groupMembersList, setGroupMembersList] = useState([]);
	const [localExpenseCurrency, setLocalExpenseCurrency] = useState('TWD');
	const [actualExpenseCurrency, setActualExpenseCurrency] = useState('TWD');
	const [errors, setErrors] = useState({});

	function handleGroupNameChange(e) {
		setGroupName(e);

		// 清除錯誤訊息
		setErrors((prev) => ({
			...prev,
			groupName: '',
		}));
	}

	function handleGroupMemberChange(e) {
		setGroupMember(e);

		// 清除錯誤訊息
		setErrors((prev) => ({
			...prev,
			groupMember: '',
		}));
	}

	function handleAddClick(groupMember) {
		// 錯誤處理，防止空白的成員名稱
		if (!groupMember.trim().length) {
			setErrors((prev) => ({
				...prev,
				groupMember: '群組成員名稱不得為空白',
			}));
			return;
		}

		// 錯誤處理，防止重複的成員名稱
		if (groupMembersList.includes(groupMember.trim())) {
			setErrors((prev) => ({
				...prev,
				groupMember: '請輸入非重複的成員名稱',
			}));
			return;
		}

		// 去除空白後儲存成員名稱
		setGroupMembersList((prev) => [groupMember.trim(), ...prev]);
		setGroupMember('');

		// 清除錯誤訊息
		setErrors((prev) => ({
			...prev,
			groupMember: '',
		}));
	}

	function handleLocalExpenseCurrencyChange(value) {
		setLocalExpenseCurrency(value);
	}

	function handleActualExpenseCurrencyChange(value) {
		setActualExpenseCurrency(value);
	}

	function handleDeleteMember(id) {
		setGroupMembersList((prev) => {
			return prev.filter((member) => {
				return member !== id;
			});
		});
	}

	function handleSubmit() {
		// 錯誤處理，群組名稱
		if (!groupName.trim().length) {
			setErrors((prev) => ({
				...prev,
				groupName: '群組名稱不得為空白',
			}));
		}

		// 錯誤處理，群組成員
		if (!groupMembersList.length) {
			setErrors((prev) => ({
				...prev,
				groupMember: '請至少輸入一位群組成員',
			}));
		}

		if (groupName === '' || !groupMembersList.length) return;

		console.log(
			'groupName:',
			groupName,
			'groupMembersList:',
			groupMembersList,
			'localExpenseCurrency:',
			localExpenseCurrency,
			'actualExpenseCurrency:',
			actualExpenseCurrency,
		);
	}

	return (
		<div className={style.page}>
			<main className={style.pageMain}>
				<h2 className={style.pageTitle}>建立群組</h2>
				<section className={style.mainSection}>
					<Input
						title='群組名稱'
						type='text'
						placeholder='請輸入群組名稱'
						value={groupName}
						onChange={(e) => handleGroupNameChange(e.target.value)}
						error={errors.groupName}
					/>
					<Select
						title='當地消費貨幣'
						optionsData={currencyData}
						value={localExpenseCurrency}
						onChange={(e) => handleLocalExpenseCurrencyChange(e.target.value)}
						error={errors.localExpenseCurrency}
					/>
					<Select
						title='實際帳單貨幣'
						optionsData={currencyData}
						value={actualExpenseCurrency}
						onChange={(e) => handleActualExpenseCurrencyChange(e.target.value)}
						error={errors.actualExpenseCurrency}
					/>
					<Input
						title='群組成員'
						type='text'
						placeholder='請輸入群組成員'
						value={groupMember}
						onChange={(e) => handleGroupMemberChange(e.target.value)}
						suffix={<Add cursor='pointer' onClick={() => handleAddClick(groupMember)} />}
						error={errors.groupMember}
					/>
					<MemberList
						groupMembersList={groupMembersList}
						onClick={(member) => handleDeleteMember(member)}
					/>
				</section>
				<Button className={style.pageButton} text='建立群組' onClick={handleSubmit} />
			</main>
		</div>
	);
}

export { SetupPage };
