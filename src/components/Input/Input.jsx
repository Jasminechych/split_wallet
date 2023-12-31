import style from 'src/components/Input/Input.module.scss';

function Input({ className, title, type, maxlength, placeholder, value, onChange, suffix, error }) {
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
			<p className={style.errorMessage}>{error ? error : ''}</p>
			<p className={style.hintMessage}>
				{value.length > 0 && maxlength ? `${value.length} / ${maxlength}` : ''}
			</p>
		</div>
	);
}

export { Input };
