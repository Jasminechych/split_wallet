import 'src/style/reset.css';
import 'src/style/base.scss';
// import { SetupPage } from 'src/pages';
// import { RecordPage } from 'src/pages/RecordPage/RecordPage';
import { BillPage } from './pages/BillPage/BillPage';

function App() {
	return (
		<div className='App'>
			{/* <SetupPage /> */}
			{/* <RecordPage /> */}
			<BillPage />
		</div>
	);
}

export default App;
