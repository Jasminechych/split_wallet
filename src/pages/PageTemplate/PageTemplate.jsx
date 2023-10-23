import style from 'src/pages/PageTemplate/PageTemplate.module.scss';
import { Button } from 'src/components/Button/Button';

function PageTemplate({ children, pageTitle, pageButtonTitle, onClick }) {
	return (
		<div className={style.page}>
			<h2 className={style.pageTitle}>{pageTitle}</h2>
			<main className={style.pageContent}>{children}</main>
			<Button className={style.pageButton} text={pageButtonTitle} onClick={onClick} />
		</div>
	);
}

export { PageTemplate };
