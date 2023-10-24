import style from 'src/pages/PageTemplate/PageTemplate.module.scss';
import { useLocation } from 'react-router-dom';
import { Button } from 'src/components/Button/Button';
import { NavbarList } from 'src/components/NavbarList/NavbarList';

function PageTemplate({ children, pageTitle, pageButtonTitle, onClick }) {
	const { pathname } = useLocation();

	console.log('pathname', pathname);

	return (
		<div className={style.page}>
			{pathname !== '/' && (
				<>
					<input id='hamburger' type='checkbox' className={style.toggleHamburgerInput} />
					<label htmlFor='hamburger' className={style.toggleHamburgerLabel}>
						<span className={style.hamburger}></span>
						<span className={style.hamburger}></span>
						<span className={style.hamburger}></span>
					</label>
					<nav className={style.pageNavbar}>
						<NavbarList />
					</nav>
				</>
			)}
			<h2 className={style.pageTitle}>{pageTitle}</h2>
			<main className={style.pageContent}>{children}</main>
			<Button className={style.pageButton} text={pageButtonTitle} onClick={onClick} />
		</div>
	);
}

export { PageTemplate };
