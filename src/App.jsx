import 'src/style/reset.css';
import 'src/style/base.scss';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SetupPage, RecordPage, BillPage, LedgerPage } from 'src/pages';
import { GroupInfoProvider } from 'src/contexts/GroupInfoContext';

function App() {
	console.log('process.env.PUBLIC_URL:', process.env.PUBLIC_URL);
	return (
		<div className='App'>
			<BrowserRouter>
				<GroupInfoProvider>
					<Routes>
						<Route path='*' element={<Navigate to='/' />} />
						<Route path='/' element={<SetupPage />} />
						<Route path='record/:groupId' element={<RecordPage />} />
						<Route path='bill/:groupId' element={<BillPage />}>
							<Route path=':billId' element={<BillPage />} />
						</Route>
						<Route path='ledger/:groupId' element={<LedgerPage />} />
					</Routes>
				</GroupInfoProvider>
			</BrowserRouter>
		</div>
	);
}

export default App;
