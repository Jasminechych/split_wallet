import style from 'src/components/NavbarList/NavbarList.module.scss';
import { NavLink, useParams } from 'react-router-dom';

function NavbarList() {
	const { id } = useParams();

	const navbarList = [
		{ key: `/record/${id}`, value: '消費紀錄' },
		{ key: `/bill/${id}`, value: '新增消費' },
		{ key: `/ledger/${id}`, value: '結算' },
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
					navigator.clipboard.writeText(`http://localhost:3000/record/${id}`);
				}}>
				複製連結
			</p>
		</nav>
	);
}

export { NavbarList };
