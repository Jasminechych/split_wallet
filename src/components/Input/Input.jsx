import style from 'src/components/Input/Input.module.scss';

function Input({ id, title, type, placeholder, value, onChange, suffix }) {
	return (
		<div className={style.inputGroup}>
			<label htmlFor={id} className={style.inputLabel}>
				{title}
			</label>
			<div className={style.inputWrapper}>
				<input
					className={style.input}
					id={id}
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
