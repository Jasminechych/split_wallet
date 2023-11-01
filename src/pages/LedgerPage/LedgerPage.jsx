import { PageTemplate } from 'src/pages/PageTemplate/PageTemplate';
import { useNavigate } from 'react-router-dom';

function LedgerPage() {
	const navigate = useNavigate();

	function handleClick() {
		navigate('/bill');
	}

	return (
		<PageTemplate pageTitle='結算' pageButtonTitle='新增消費' onClick={handleClick}>
			<h4>結算的資料</h4>
		</PageTemplate>
	);
}

export { LedgerPage };
