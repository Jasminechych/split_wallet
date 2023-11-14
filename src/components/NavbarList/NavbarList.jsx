import style from 'src/components/NavbarList/NavbarList.module.scss';
import { NavLink, useParams, useNavigate } from 'react-router-dom';

function NavbarList() {
	// react-router-dom
	const navigate = useNavigate();
	const { groupId } = useParams();

	const navbarList = [
		{ key: `/record/${groupId}`, value: '消費紀錄' },
		{ key: `/bill/${groupId}`, value: '新增消費' },
		{ key: `/ledger/${groupId}`, value: '結算紀錄' },
	];

	return (
		<nav className={style.navbarList}>
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
			<p
				className={style.navItem}
				onClick={() => {
					navigator.clipboard.writeText(`http://localhost:3000/record/${groupId}`);
				}}>
				複製連結
			</p>
			<p
				className={style.navItem}
				onClick={() => {
					navigate('/');
				}}>
				建立群組
			</p>
		</nav>
	);
}

export { NavbarList };
