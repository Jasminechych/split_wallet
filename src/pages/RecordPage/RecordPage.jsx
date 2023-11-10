import { useEffect, useState } from 'react';
import { PageTemplate } from 'src/pages/PageTemplate/PageTemplate';
import { RecordList } from 'src/components/RecordList/RecordList';
import { useNavigate } from 'react-router-dom';
import db from 'src/libraries/utils/firebase';
import { doc, collection, getDocs, deleteDoc } from 'firebase/firestore';

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
	const [recordData, setRecordData] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchBillsData = async () => {
			try {
				// 測試用
				const tempId = '7SDElmh9lQhcBWjIYz18';
				const docRef = doc(db, 'group', tempId);
				const billsCollectionRef = collection(docRef, 'bills');
				const querySnapshot = await getDocs(billsCollectionRef);

				const dataCollection = [];
				querySnapshot.forEach((doc) => {
					const data = doc.data();
					const documentId = doc.id;

					dataCollection.push({ id: documentId, ...data });
				});

				setRecordData(dataCollection);

				setIsLoading(false);
			} catch (e) {
				console.error('Error fetching bill data:', e);
			}
		};

		fetchBillsData();
	}, []);

	function handleClick(route) {
		navigate(route);
	}

	async function handleDeleteRecord(billId) {
		console.log('billId', billId);
		setIsLoading(true);

		try {
			const tempId = '7SDElmh9lQhcBWjIYz18';
			const docRef = doc(db, 'group', tempId);
			const billDocRef = doc(docRef, 'bills', billId);
			await deleteDoc(billDocRef);

			setRecordData((prev) => {
				return prev.filter((item) => item.id !== billId);
			});

			setIsLoading(false);
		} catch (e) {
			console.error('Error deleting bill data:', e);
		}
	}

	return (
		<PageTemplate
			pageTitle='消費紀錄'
			pageButtonTitle={data.length ? '結算' : '新增消費'}
			onClick={data.length ? () => handleClick('/ledger') : () => handleClick('/bill')}>
			{isLoading ? (
				<></>
			) : (
				<RecordList data={recordData} handleDeleteRecord={(id) => handleDeleteRecord(id)} />
			)}
		</PageTemplate>
	);
}

export { RecordPage };
