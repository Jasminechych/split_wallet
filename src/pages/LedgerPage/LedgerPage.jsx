import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageTemplate } from 'src/pages/PageTemplate/PageTemplate';
import { LedgerList } from 'src/components/LedgerList/LedgerList';
import { useEffect } from 'react';
import db from 'src/libraries/utils/firebase';
import { doc, getDocs, collection, getDoc } from 'firebase/firestore';
import { round } from 'src/libraries/utils/round';

function LedgerPage() {
	const [ledgerData, setLedgerlData] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();
	const { id } = useParams();

	// 測試用
	const tempId = id;

	useEffect(() => {
		setIsLoading(true);

		const fetchBillsData = async () => {
			try {
				// 測試用
				const docRef = doc(db, 'group', tempId);
				const groupData = await getDoc(docRef);
				const membersData = groupData.data().groupMembersList;

				const billsCollectionRef = collection(docRef, 'bills');
				const querySnapshot = await getDocs(billsCollectionRef);

				const dataCollection = [];
				querySnapshot.forEach((doc) => {
					const data = doc.data();
					const documentId = doc.id;

					dataCollection.push({ id: documentId, ...data });
				});

				const debtsData = dataCollection.reduce((acc, item) => {
					const itemDebt = calculateDebts(
						item.payerPayments,
						item.splitPayments,
						item.rate,
						item.actualExpenseCurrency,
					);

					return [...acc, ...itemDebt];
				}, []);

				console.log('debtsData', debtsData);

				const totalDebtsData = calculateTotalDebts(debtsData);
				console.log('totalDebtsData', totalDebtsData);

				const mapMemberIdToName = (memberId) => {
					const member = membersData.find((member) => member.memberId === memberId);
					return member ? member.memberName : memberId;
				};

				const transformedDebtsData = totalDebtsData.map((debt) => ({
					debtor: mapMemberIdToName(debt.debtor),
					creditor: mapMemberIdToName(debt.creditor),
					amount: debt.amount,
					currency: debt.currency,
				}));

				console.log(
					'transformedDebtsData',
					transformedDebtsData.sort((a, b) => a.debtor.localeCompare(b.debtor)),
				);

				setLedgerlData(transformedDebtsData);

				setIsLoading(false);
			} catch (e) {
				console.error('Error fetching group data:', e);
			}
		};

		fetchBillsData();
	}, []);

	// 對一筆 bill 的債務計算
	function calculateDebts(creditorData, debtorData, rate, currency) {
		let debt = [];

		for (const creditorId in creditorData) {
			for (const debtorId in debtorData) {
				const debtorPayableAmount = Number(debtorData[debtorId].amount);
				const debtorPaidAmount = Number(creditorData[debtorId].amount);
				const creditorPayableAmount = Number(debtorData[creditorId].amount);
				const creditorPaidAmount = Number(creditorData[creditorId].amount);

				// 潛在債務人
				const potentialDebtor =
					debtorPayableAmount > 0 && debtorPayableAmount - debtorPaidAmount > 0;

				// 潛在債權人
				const potentialCreditor = creditorPaidAmount - creditorPayableAmount > 0;

				if (!potentialDebtor || !potentialCreditor || debtorId === creditorId) continue;

				// 債務人債款
				const debtorDebts = round(debtorPayableAmount - debtorPaidAmount, 2);

				// 債權人債款
				const creditorDebts = round(creditorPaidAmount - creditorPayableAmount, 2);

				// 債權人債款 >= 債務人債款，債務人債款 應全部給 債權人
				if (Number(creditorDebts) >= Number(debtorDebts)) {
					debt.push({
						debtor: debtorId,
						creditor: creditorId,
						amount: round(Number(debtorDebts) / Number(rate), 2),
						currency: currency,
					});
				} else {
					// 債權人債款 < 債務人債款，債務人 只需補足 債權人債款
					debt.push({
						debtor: debtorId,
						creditor: creditorId,
						amount: round(Number(creditorDebts) / Number(rate), 2),
						currency: currency,
					});
				}
			}
		}

		return debt;
	}

	function calculateTotalDebts(debtsData) {
		const summedDebtsMap = new Map();

		debtsData.forEach((debt) => {
			const key1 = `${debt.debtor}_${debt.creditor}_${debt.currency}`;
			const key2 = `${debt.creditor}_${debt.debtor}_${debt.currency}`;

			if (summedDebtsMap.has(key2)) {
				const key2Value = summedDebtsMap.get(key2);
				const debtAmount = Number(debt.amount);

				if (key2Value >= debtAmount) {
					summedDebtsMap.set(key2, key2Value - debtAmount);
					if (summedDebtsMap.get(key2) === 0) {
						summedDebtsMap.delete(key2);
					}
				} else {
					summedDebtsMap.set(key2, 0);
					summedDebtsMap.set(key1, debtAmount - key2Value);
					if (summedDebtsMap.get(key2) === 0) {
						summedDebtsMap.delete(key2);
					}
				}
			} else {
				const value = (summedDebtsMap.get(key1) || 0) + Number(debt.amount);

				summedDebtsMap.set(key1, value);
			}
		});

		const result = Array.from(summedDebtsMap).map(([key, amount]) => {
			const [debtor, creditor, currency] = key.split('_');

			return {
				debtor,
				creditor,
				amount: round(amount, 2),
				currency,
			};
		});

		return result;
	}

	function handleClick() {
		navigate(`/bill/${id}`);
	}

	return (
		<PageTemplate pageTitle='結算' pageButtonTitle='新增消費' onClick={handleClick}>
			{isLoading ? <></> : <LedgerList data={ledgerData} />}
		</PageTemplate>
	);
}

export { LedgerPage };
