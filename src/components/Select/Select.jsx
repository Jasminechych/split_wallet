import style from 'src/components/Select/Select.module.scss';

function Select({ title, optionsData, value, onChange }) {
	return (
		<div className={style.selectGroup}>
			<div className={style.selectLabel}>{title}</div>
			<select className={style.select} value={value} onChange={onChange}>
				{optionsData.map(({ key, value }) => (
					<option key={key}>{value}</option>
				))}
			</select>
		</div>
	);
}

export { Select };
