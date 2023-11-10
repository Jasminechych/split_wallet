import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageTemplate } from 'src/pages/PageTemplate/PageTemplate';
import { LedgerList } from 'src/components/LedgerList/LedgerList';
import { useEffect } from 'react';
// import db from 'src/libraries/utils/firebase';
// import { doc, getDocs, collection, getDoc } from 'firebase/firestore';
import { round } from 'src/libraries/utils/round';
import { getBills, getGroupInfo } from 'src/apis/apis';

function LedgerPage() {
	const [ledgerData, setLedgerlData] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	// react-router
	const navigate = useNavigate();
	const { id } = useParams();
	const groupId = id;

	useEffect(() => {
		const fetchBillsData = async () => {
			setIsLoading(true);

			const { successGetGroupInfo, groupInfo } = await getGroupInfo(groupId);
			const { successGetBills, billsData } = await getBills(groupId);

			if (successGetGroupInfo && successGetBills) {
				const membersData = groupInfo.groupMembersList;

				const debtsData = billsData.reduce((acc, item) => {
					const itemDebt = calculateDebts(
						item.payerPayments,
						item.splitPayments,
						item.rate,
						item.actualExpenseCurrency,
					);

					return [...acc, ...itemDebt];
				}, []);

				const totalDebtsData = calculateTotalDebts(debtsData);

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

				setLedgerlData(transformedDebtsData);
			} else {
				window.alert('讀取資料錯誤');
			}

			setIsLoading(false);
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

	function handleButtonClick() {
		navigate(`/bill/${groupId}`);
	}

	return (
		<PageTemplate pageTitle='結算' pageButtonTitle='新增消費' onClick={handleButtonClick}>
			{isLoading ? <></> : <LedgerList data={ledgerData} />}
		</PageTemplate>
	);
}

export { LedgerPage };
