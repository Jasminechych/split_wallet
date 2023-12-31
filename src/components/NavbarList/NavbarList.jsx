import style from 'src/components/NavbarList/NavbarList.module.scss';
import { NavLink, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useGroupInfo } from 'src/contexts/GroupInfoContext';

function NavbarList() {
	// react-router-dom
	const navigate = useNavigate();

	// context
	const { groupIdentification, handleGroupIdentificationChange, groupData } = useGroupInfo();

	const navbarList = [
		{ key: `/record/${groupIdentification}`, value: '消費紀錄' },
		{ key: `/bill/${groupIdentification}`, value: '新增消費' },
		{ key: `/ledger/${groupIdentification}`, value: '結算紀錄' },
	];

	function handleCopyLink() {
		navigator.clipboard.writeText(
			`${process.env.REACT_APP_PUBLIC_URL}/record/${groupIdentification}`,
		);
		Swal.fire({
			position: 'center',
			icon: 'success',
			title: '複製連結成功',
			showConfirmButton: false,
			timer: 1000,
		});
	}

	function handleLogOut() {
		handleGroupIdentificationChange('');
		navigate('/');
	}

	return (
		<nav className={style.navbarList}>
			<h5 className={style.groupName}>{groupData.groupName}</h5>
			{navbarList.map(({ key, value }) => {
				return (
					<NavLink
						to={key}
						key={key}
						className={({ isActive }) => (isActive ? style.navItemActive : style.navItem)}>
						{value}
					</NavLink>
				);
			})}
			<p className={style.navItem} onClick={handleCopyLink}>
				複製連結
			</p>
			<p className={`${style.navItem} ${style.navItemLogOut}`} onClick={handleLogOut}>
				建立新群組
			</p>
		</nav>
	);
}

export { NavbarList };
