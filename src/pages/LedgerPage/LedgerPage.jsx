import { useNavigate } from 'react-router-dom';
import { PageTemplate } from 'src/pages/PageTemplate/PageTemplate';
import { LedgerList } from 'src/components/LedgerList/LedgerList';

function LedgerPage() {
	const navigate = useNavigate();

	function handleClick() {
		navigate('/bill');
	}

	return (
		<PageTemplate pageTitle='結算' pageButtonTitle='新增消費' onClick={handleClick}>
			<LedgerList />
		</PageTemplate>
	);
}

export { LedgerPage };
