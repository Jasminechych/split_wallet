import style from 'src/components/Button/Button.module.scss';

function Button({ className, text, onClick }) {
	return (
		<button className={`${className} ${style.button}`} onClick={onClick}>
			{text}
		</button>
	);
}

export { Button };
