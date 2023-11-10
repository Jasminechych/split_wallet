import { useEffect, useState } from 'react';
import { PageTemplate } from 'src/pages/PageTemplate/PageTemplate';
import { RecordList } from 'src/components/RecordList/RecordList';
import { useNavigate, useParams } from 'react-router-dom';
import db from 'src/libraries/utils/firebase';
import { doc, collection, getDocs, deleteDoc } from 'firebase/firestore';

function RecordPage() {
	const [recordData, setRecordData] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();
	const { id } = useParams();

	// 測試用
	const tempId = id;

	useEffect(() => {
		const fetchBillsData = async () => {
			try {
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
			pageButtonTitle={recordData.length ? '結算' : '新增消費'}
			onClick={
				recordData.length ? () => handleClick(`/ledger/${id}`) : () => handleClick(`/bill/${id}`)
			}>
			{isLoading ? (
				<></>
			) : (
				<RecordList data={recordData} handleDeleteRecord={(id) => handleDeleteRecord(id)} />
			)}
		</PageTemplate>
	);
}

export { RecordPage };
