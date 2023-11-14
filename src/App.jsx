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
						<Route path='record'>
							<Route path=':id' element={<RecordPage />} />
						</Route>
						<Route path='bill'>
							<Route path=':id' element={<BillPage />} />
							<Route path=':id/:billId' element={<BillPage />} />
						</Route>
						<Route path='ledger'>
							<Route path=':id' element={<LedgerPage />} />
						</Route>
					</Routes>
				</GroupInfoProvider>
			</BrowserRouter>
		</div>
	);
}

export default App;
