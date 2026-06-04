import React, { createContext, useContext, useState } from "react";

const GroupContext = createContext();

export function GroupProvider({ children }) {
  const [groups, setGroups] = useState([]);

  // ➕ CREATE GROUP
  const addGroup = (name) => {
    const newGroup = {
      id: Date.now(),
      name,
      members: [],
      expenses: []
    };

    setGroups((prev) => [...prev, newGroup]);
  };

  // 👤 ADD MEMBER
  const addMember = (groupId, memberName) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? { ...g, members: [...g.members, memberName] }
          : g
      )
    );
  };

  return (
    <GroupContext.Provider value={{ groups, addGroup, addMember }}>
      {children}
    </GroupContext.Provider>
  );
}

export function useGroups() {
  return useContext(GroupContext);
}