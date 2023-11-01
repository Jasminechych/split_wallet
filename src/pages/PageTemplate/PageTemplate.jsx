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
				<aside>
					<input id='hamburger' type='checkbox' className={style.toggleHamburgerInput} />
					<label htmlFor='hamburger' className={style.toggleHamburgerLabel}>
						<span className={style.hamburger}></span>
						<span className={style.hamburger}></span>
						<span className={style.hamburger}></span>
					</label>
					<div className={style.pageNavbar}>
						<NavbarList />
					</div>
				</aside>
			)}

			<main className={style.pageMain}>
				<h2 className={style.pageTitle}>{pageTitle}</h2>
				<section className={style.mainSection}>{children}</section>
				<Button className={style.pageButton} text={pageButtonTitle} onClick={onClick} />
			</main>
		</div>
	);
}

export { PageTemplate };
