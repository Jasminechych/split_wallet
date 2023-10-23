import 'src/style/reset.css';
import 'src/style/base.scss';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SetupPage, RecordPage, BillPage } from 'src/pages';

function App() {
	return (
		<div className='App'>
			<BrowserRouter>
				<Routes>
					<Route path='/' element={<SetupPage />} />
					<Route path='record' element={<RecordPage />} />
					<Route path='bill' element={<BillPage />} />
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;
