import { useEffect, useState } from 'react';
import { PageTemplate } from 'src/pages/PageTemplate/PageTemplate';
import { RecordList } from 'src/components/RecordList/RecordList';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteBill, getBills } from 'src/apis/apis';

function RecordPage() {
	const [recordData, setRecordData] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	// react-router-dom
	const navigate = useNavigate();
	const { groupId } = useParams();

	useEffect(() => {
		const fetchBillsData = async () => {
			setIsLoading(true);

			const { successGetBills, billsData } = await getBills(groupId);

			if (successGetBills) {
				setRecordData(billsData);
				setIsLoading(false);
			} else {
				window.alert('讀取資料錯誤，請再試一次');
			}

			setIsLoading(false);
		};

		fetchBillsData();
	}, []);

	function handleButtonClick(route) {
		navigate(route);
	}

	function handleUpdateRecord(id) {
		navigate(`/bill/${groupId}/${id}`);
	}

	async function handleDeleteRecord(billId) {
		setIsLoading(true);

		const { successDeleteBill } = await deleteBill(groupId, billId);

		if (successDeleteBill) {
			setRecordData((prev) => {
				return prev.filter((item) => item.id !== billId);
			});
		} else {
			window.alert('刪除資料失敗');
		}

		setIsLoading(false);
	}

	return (
		<PageTemplate
			pageTitle='消費紀錄'
			pageButtonTitle={recordData.length ? '結算' : '新增消費'}
			onClick={
				recordData.length
					? () => handleButtonClick(`/ledger/${groupId}`)
					: () => handleButtonClick(`/bill/${groupId}`)
			}>
			{isLoading ? (
				<></>
			) : (
				<RecordList
					data={recordData}
					handleUpdateRecord={(id) => {
						handleUpdateRecord(id);
					}}
					handleDeleteRecord={(id) => handleDeleteRecord(id)}
				/>
			)}
		</PageTemplate>
	);
}

export { RecordPage };
