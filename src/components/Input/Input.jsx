import style from 'src/components/Input/Input.module.scss';

function Input({ className, title, type, placeholder, value, onChange, suffix }) {
	return (
		<div className={`${className} ${style.inputGroup}`}>
			<label htmlFor={title} className={style.inputLabel}>
				{title}
			</label>
			<div className={style.inputWrapper}>
				<input
					className={style.input}
					id={title}
					type={type}
					placeholder={placeholder}
					value={value}
					onChange={onChange}
				/>
				{suffix}
			</div>
		</div>
	);
}

export { Input };
