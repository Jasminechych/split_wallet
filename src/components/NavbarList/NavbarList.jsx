import style from 'src/components/NavbarList/NavbarList.module.scss';
import { NavLink } from 'react-router-dom';

const navbarList = [
	{ key: '/record', value: '消費紀錄' },
	{ key: '/bill', value: '新增消費' },
	{ key: '/ledger', value: '結算' },
];

function NavbarList() {
	return (
		<div className={style.navbarList}>
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
					navigator.clipboard.writeText('http://localhost:3000/record');
				}}>
				複製連結
			</p>
		</div>
	);
}

export { NavbarList };
