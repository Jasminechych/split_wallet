import { PageTemplate } from 'src/pages/PageTemplate/PageTemplate';
import { RecordList } from 'src/components/RecordList/RecordList';
import { useNavigate } from 'react-router-dom';

const data = [
	{ id: 1, title: '早餐', date: '2023/05/12' },
	{ id: 2, title: '晚餐', date: '2023/05/12' },
	{ id: 3, title: '晚餐', date: '2023/05/12' },
	{ id: 4, title: '晚餐', date: '2023/05/12' },
	{ id: 5, title: '晚餐', date: '2023/05/12' },
	{ id: 6, title: '晚餐', date: '2023/05/12' },
	{ id: 7, title: '晚餐', date: '2023/05/12' },
	{ id: 8, title: '晚餐', date: '2023/05/12' },
	{ id: 9, title: '晚餐', date: '2023/05/12' },
	{ id: 10, title: '晚餐', date: '2023/05/12' },
];

function RecordPage() {
	const navigate = useNavigate();

	function handleClick(route) {
		navigate(route);
	}

	return (
		<PageTemplate
			pageTitle='消費紀錄'
			pageButtonTitle={data.length ? '結算' : '新增消費'}
			onClick={data.length ? () => handleClick('/ledger') : () => handleClick('/bill')}>
			<RecordList data={data} />
		</PageTemplate>
	);
}

export { RecordPage };
