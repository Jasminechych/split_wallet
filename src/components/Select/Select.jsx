import style from 'src/components/Select/Select.module.scss';

function Select({ title, optionsData, value, onChange, className }) {
	return (
		<div className={className === 'suffix' ? style.selectGroupSuffix : style.selectGroup}>
			<div className={style.selectLabel}>{title}</div>
			<div className={style.selectWrapper}>
				<select className={style.select} value={value} onChange={onChange}>
					{optionsData.map(({ key, value }) => (
						<option key={key}>{value}</option>
					))}
				</select>
			</div>
		</div>
	);
}

export { Select };
