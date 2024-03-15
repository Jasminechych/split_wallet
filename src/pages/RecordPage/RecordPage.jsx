import { PageTemplate } from 'src/pages/PageTemplate/PageTemplate';
import { RecordList } from 'src/components/RecordList/RecordList';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteBill } from 'src/apis/apis';
import { Loading } from 'src/assets/icons';
import Swal from 'sweetalert2';
import { useGroupInfo } from 'src/contexts/GroupInfoContext';
import { useEffect } from 'react';

function RecordPage() {
	// react-router-dom
	const navigate = useNavigate();
	const { groupId } = useParams();

	// context
	const {
		groupIdentification,
		handleGroupIdentificationChange,
		billsCollection,
		setBillsCollection,
		isLoading,
		setIsLoading,
	} = useGroupInfo();

	useEffect(() => {
		if (groupIdentification !== groupId) {
			handleGroupIdentificationChange(groupId);
		}
	}, [groupId]);

	function handleButtonClick(route) {
		navigate(route);
	}

	function handleUpdateRecord(id) {
		navigate(`/bill/${groupIdentification}/${id}`);
	}

	async function handleDeleteRecord(billId) {
		setIsLoading(true);

		Swal.fire({
			title: '確定要刪除這筆紀錄？',
			text: '刪除後資料將無法復原',
			icon: 'question',
			showDenyButton: true,
			confirmButtonText: '刪除',
			denyButtonText: `不要刪除`,
		}).then(async (result) => {
			if (result.isConfirmed) {
				const { successDeleteBill } = await deleteBill(groupId, billId);
				if (successDeleteBill) {
					setBillsCollection((prev) => {
						return prev.filter((item) => item.id !== billId);
					});
					Swal.fire({
						position: 'center',
						icon: 'success',
						title: '刪除成功',
						showConfirmButton: false,
						timer: 1000,
					});
				} else {
					Swal.fire({
						position: 'center',
						icon: 'error',
						title: '刪除失敗，請稍後再試',
						showConfirmButton: false,
						timer: 1000,
					});
				}
			} else if (result.isDenied) {
				Swal.fire('取消刪除', '', 'info');
			}
		});

		setIsLoading(false);
	}

	return (
		<PageTemplate
			pageTitle='消費紀錄'
			pageButtonTitle={billsCollection.length ? '結算' : '新增消費'}
			onClick={
				billsCollection.length
					? () => handleButtonClick(`/ledger/${groupId}`)
					: () => handleButtonClick(`/bill/${groupId}`)
			}>
			{isLoading ? (
				<Loading />
			) : (
				<RecordList
					data={billsCollection}
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
