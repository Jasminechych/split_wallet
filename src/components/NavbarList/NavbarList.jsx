import style from 'src/components/NavbarList/NavbarList.module.scss';
import { NavLink, useParams, useNavigate } from 'react-router-dom';

function NavbarList() {
	const navigate = useNavigate();
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
			<p
				className={style.navItem}
				onClick={() => {
					navigate('/');
				}}>
				回到註冊頁
			</p>
		</nav>
	);
}

export { NavbarList };
