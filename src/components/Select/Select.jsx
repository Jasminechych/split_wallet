import style from 'src/components/Select/Select.module.scss';

function Select({ selectTitle, optionsData, value, onChange }) {
	return (
		<div className={style.selectGroup}>
			<div className={style.selectLabel}>{selectTitle}</div>
			<select className={style.select} value={value} onChange={onChange}>
				{optionsData.map(({ type, title }) => (
					<option key={type}>{title}</option>
				))}
			</select>
		</div>
	);
}

export { Select };
