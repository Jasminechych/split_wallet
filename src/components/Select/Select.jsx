import style from 'src/components/Select/Select.module.scss';

function Select({ className, title, optionsData, value, onChange, children, suffix }) {
	return (
		<div className={`${className} ${style.selectGroup}`}>
			<div className={style.selectLabel}>{title}</div>
			<div className={suffix ? style.suffixWrapper : style.selectWrapper}>
				<select className={style.select} value={value} onChange={onChange}>
					{optionsData.map(({ key, value }) => (
						<option key={key}>{value}</option>
					))}
				</select>
				{/* {children} */}
			</div>
			<div className={style.distribution}>{children}</div>
		</div>
	);
}

export { Select };
