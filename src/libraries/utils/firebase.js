import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
	apiKey: 'AIzaSyBPtHnOfT7X0zVr5eaXRdM4i85F_jSaOKI',
	authDomain: 'split-wallet-d8e40.firebaseapp.com',
	projectId: 'split-wallet-d8e40',
	storageBucket: 'split-wallet-d8e40.appspot.com',
	messagingSenderId: '111584890082',
	appId: '1:111584890082:web:8d2ed214efeaf8c3e8e2bb',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
