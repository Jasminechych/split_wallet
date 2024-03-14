import { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';
import { getBills, addBill, updateBill, getGroupInfo } from 'src/apis/apis';

const GroupInfoContext = createContext();

function GroupInfoProvider({ children }) {
	const [isLoading, setIsLoading] = useState(false);
	const [groupIdentification, setGroupIdentification] = useState('');
	const [billsCollection, setBillsCollection] = useState([]);
	const [billAction, setBillAction] = useState(false);
	const [groupData, setGroupData] = useState({
		groupName: '',
		groupMembersList: [],
		localExpenseCurrency: 'TWD',
		actualExpenseCurrency: 'TWD',
	});

	const handleGroupIdentificationChange = useCallback((id) => {
		setGroupIdentification(id);
	}, []);

	const createBill = useCallback(
		async (groupId, billData, imageUrl) => {
			try {
				setIsLoading(true);

				const { successAddBill } = await addBill(groupId, billData, imageUrl);
				if (successAddBill) {
					setBillAction(!billAction);
					setIsLoading(false);
					return { success: true };
				}
				setBillAction(!billAction);
			} catch (e) {
				console.log('createBill failed: ', e);
				setBillAction(!billAction);
				setIsLoading(false);

				return { success: false };
			}
		},
		[billAction],
	);

	const updateBillData = useCallback(
		async (groupId, billId, billData, imageUrl) => {
			setIsLoading(true);
			try {
				const { successUpdateBill } = await updateBill(groupId, billId, billData, imageUrl);
				if (successUpdateBill) {
					setBillAction(!billAction);
					setIsLoading(false);
					return { success: true };
				}
			} catch (e) {
				console.log('updateBillData failed: ', e);
				setIsLoading(false);
				return { success: false };
			}
		},
		[billAction],
	);

	useEffect(() => {
		const fetchBills = async () => {
			if (!groupIdentification) return;

			setIsLoading(true);
			try {
				const { successGetBills, billsData } = await getBills(groupIdentification);
				if (successGetBills) {
					setBillsCollection(billsData);
					setIsLoading(false);
				}
			} catch (e) {
				console.log('fetchBills failed', e);
				setIsLoading(true);
			}
		};
		fetchBills();
	}, [groupIdentification, billAction]);

	useEffect(() => {
		const fetchGroupData = async () => {
			if (!groupIdentification) {
				setGroupData((prev) => ({
					...prev,
					groupName: '',
					groupMembersList: [],
					localExpenseCurrency: 'TWD',
					actualExpenseCurrency: 'TWD',
				}));

				return;
			}

			setIsLoading(true);
			try {
				const { successGetGroupInfo, groupInfo } = await getGroupInfo(groupIdentification);

				if (successGetGroupInfo) {
					setGroupData((prev) => ({
						...prev,
						groupName: groupInfo.groupName,
						groupMembersList: groupInfo.groupMembersList,
						localExpenseCurrency: groupInfo.localExpenseCurrency,
						actualExpenseCurrency: groupInfo.actualExpenseCurrency,
					}));
				}
			} catch (e) {
				console.log('fetchGroupData failed', e);
			}

			setIsLoading(false);
		};

		fetchGroupData();
	}, [groupIdentification]);

	// memo data
	const groupInfoContextData = useMemo(() => {
		return {
			groupIdentification,
			handleGroupIdentificationChange,
			billsCollection,
			setBillsCollection,
			isLoading,
			setIsLoading,
			groupData,
			setGroupData,
			createBill,
			updateBillData,
		};
	}, [
		groupIdentification,
		handleGroupIdentificationChange,
		billsCollection,
		setBillsCollection,
		isLoading,
		setIsLoading,
		groupData,
		setGroupData,
		createBill,
		updateBillData,
	]);

	return (
		<GroupInfoContext.Provider value={groupInfoContextData}>{children}</GroupInfoContext.Provider>
	);
}

// 匯出取用這個 context 的方法
function useGroupInfo() {
	const GroupInfoData = useContext(GroupInfoContext);

	// 確保 Context 不會是空的
	if (GroupInfoData === undefined) {
		throw new Error('useGroupInfo must be used within a GroupInfoProvider');
	}

	return GroupInfoData;
}

export { GroupInfoProvider, useGroupInfo };
