import { createContext, useContext, useState, useMemo } from 'react';

const GroupInfoContext = createContext();

function GroupInfoProvider({ children }) {
	const [groupInfo, setGroupInfo] = useState();

	function handleGroupInfoChange(data) {
		setGroupInfo(data);
	}

	const groupInfoContextData = useMemo(() => {
		return {
			groupInfo,
			handleGroupInfoChange,
		};
	}, [groupInfo, handleGroupInfoChange]);

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
