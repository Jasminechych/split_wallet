import 'src/style/reset.css';
import 'src/style/base.scss';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SetupPage, RecordPage, BillPage, LedgerPage } from 'src/pages';
import { GroupInfoProvider } from 'src/contexts/GroupInfoContext';

function App() {
	return (
		<div className='App'>
			<BrowserRouter>
				<GroupInfoProvider>
					<Routes>
						<Route path='/' element={<SetupPage />} />
						<Route path='record' element={<RecordPage />} />
						<Route path='bill' element={<BillPage />} />
						<Route path='ledger' element={<LedgerPage />} />
					</Routes>
				</GroupInfoProvider>
			</BrowserRouter>
		</div>
	);
}

export default App;
