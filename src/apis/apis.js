import db from 'src/libraries/utils/firebase';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { collection, addDoc, doc, getDoc, getDocs, deleteDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

const storage = getStorage();

const anonymousLogin = async () => {
	const auth = getAuth();
	try {
		await signInAnonymously(auth);
		console.log('匿名登入成功');
	} catch (error) {
		console.error('匿名登入失敗', error);
	}
};

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

const addBill = async (groupId, dataObj, file) => {
	try {
		const groupRef = doc(db, 'group', groupId);
		const billsCollectionRef = collection(groupRef, 'bills');
		const billDocRef = await addDoc(billsCollectionRef, dataObj);

		if (file) {
			const fileRef = ref(storage, 'bill-images/' + billDocRef.id);
			const metadata = {
				contentType: file.type,
			};
			await uploadBytes(fileRef, file, metadata);
			const imageUrl = await getDownloadURL(fileRef);
			await updateDoc(billDocRef, { ...dataObj, imageUrl });
		}

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

		const desertRef = ref(storage, `bill-images/${billId}`);

		if (desertRef.isRoot) {
			await deleteObject(desertRef);
		}

		return { successDeleteBill: true };
	} catch (e) {
		console.error('Error deleting bill data:', e);

		return { successDeleteBill: false };
	}
};

const updateBill = async (groupId, billId, dataObj, file) => {
	try {
		const groupRef = doc(db, 'group', groupId);
		const billDocRef = doc(groupRef, 'bills', billId);

		if (file) {
			const fileRef = ref(storage, 'bill-images/' + billDocRef.id);
			const metadata = {
				contentType: file.type,
			};
			await uploadBytes(fileRef, file, metadata);
			const imageUrl = await getDownloadURL(fileRef);
			await updateDoc(billDocRef, { ...dataObj, imageUrl });
		} else {
			await updateDoc(billDocRef, dataObj);
		}

		return { successUpdateBill: true };
	} catch (e) {
		console.error('Error updating bill data:', e);

		return { successUpdateBill: false };
	}
};

export {
	anonymousLogin,
	addGroup,
	getGroupInfo,
	addBill,
	getBill,
	getBills,
	deleteBill,
	updateBill,
};
