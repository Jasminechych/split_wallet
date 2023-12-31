import db from 'src/libraries/utils/firebase';
import { collection, addDoc, doc, getDoc, getDocs, deleteDoc, updateDoc } from 'firebase/firestore';

const addGroup = async (dataObj) => {
	try {
		const groupRef = await addDoc(collection(db, 'group'), dataObj);

		return { successAddGroup: true, groupId: groupRef.id };
	} catch (e) {
		console.error('Error adding document: ', e);

		return { success: false };
	}
};

const getGroupInfo = async (groupId) => {
	try {
		const groupRef = doc(db, 'group', groupId);
		const getDocData = await getDoc(groupRef);
		const parsedData = getDocData.data();

		return { successGetGroupInfo: true, groupInfo: parsedData };
	} catch (e) {
		console.error('Error fetching group data:', e);

		return { successGetGroupInfo: false };
	}
};

const addBill = async (groupId, dataObj) => {
	try {
		const groupRef = doc(db, 'group', groupId);
		const billsCollectionRef = collection(groupRef, 'bills');
		await addDoc(billsCollectionRef, dataObj);

		return { successAddBill: true };
	} catch (e) {
		console.error('Error adding doc: ', e);

		return { successAddBill: false };
	}
};

const getBill = async (groupId, billId) => {
	try {
		const groupRef = doc(db, 'group', groupId);
		const billDocRef = doc(groupRef, 'bills', billId);
		const getDocData = await getDoc(billDocRef);
		const parsedData = getDocData.data();

		return { successGetBill: true, data: parsedData };
	} catch (e) {
		console.error('Error getting bill data:', e);

		return { successGetBill: false };
	}
};

const getBills = async (groupId) => {
	try {
		const groupRef = doc(db, 'group', groupId);
		const billsCollectionRef = collection(groupRef, 'bills');
		const querySnapshot = await getDocs(billsCollectionRef);

		const dataCollection = [];
		querySnapshot.forEach((doc) => {
			const data = doc.data();
			const documentId = doc.id;

			dataCollection.push({ id: documentId, ...data });
		});

		return { successGetBills: true, billsData: dataCollection };
	} catch (e) {
		console.error('Error fetching bill data:', e);

		return { successGetBills: false };
	}
};

const deleteBill = async (groupId, billId) => {
	try {
		const groupRef = doc(db, 'group', groupId);
		const billDocRef = doc(groupRef, 'bills', billId);
		await deleteDoc(billDocRef);

		return { successDeleteBill: true };
	} catch (e) {
		console.error('Error deleting bill data:', e);

		return { successDeleteBill: false };
	}
};

const updateBill = async (groupId, billId, dataObj) => {
	try {
		const groupRef = doc(db, 'group', groupId);
		const billDocRef = doc(groupRef, 'bills', billId);
		await updateDoc(billDocRef, dataObj);

		return { successUpdateBill: true };
	} catch (e) {
		console.error('Error updating bill data:', e);

		return { successUpdateBill: false };
	}
};

export { addGroup, getGroupInfo, addBill, getBill, getBills, deleteBill, updateBill };
