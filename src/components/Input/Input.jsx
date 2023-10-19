import style from 'src/components/Input/Input.module.scss';
import { Add } from 'src/assets/icons';

function Input({ id, groupTitle, type, placeholder, value, onChange, iconAdd, onClick }) {
	return (
		<div className={style.inputGroup}>
			<label htmlFor={id} className={style.inputLabel}>
				{groupTitle}
			</label>
			<input
				className={style.input}
				id={id}
				type={type}
				placeholder={placeholder}
				value={value}
				onChange={onChange}
			/>
			{iconAdd && <Add className={style.add} onClick={onClick} />}
		</div>
	);
}

export { Input };
