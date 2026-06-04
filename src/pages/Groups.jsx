import React, { useEffect, useState } from "react";
import databaseService from "../appwrite/database";
import authService from "../appwrite/auth";
import { useNavigate } from "react-router-dom";
import "./Groups.css";

function Groups() {
  const [groups, setGroups] = useState([]);
  const [name, setName] = useState("");
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  // FETCH GROUPS
  const fetchGroups = async () => {
    try {
      const user = await authService.getCurrentUser();
      if (!user) return;

      const res = await databaseService.getGroups(user.$id);
      setGroups(res.documents);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  // CREATE GROUP
  const handleCreateGroup = async () => {
    try {
      const user = await authService.getCurrentUser();
      if (!user) return;

      if (!name) return alert("Enter group name");

      await databaseService.createGroup({
        name,
        userId: user.$id,
      });

      setName("");
      setShowModal(false);
      fetchGroups();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="groups-container">

      {/* HEADER */}
      <div className="groups-header">
        <h1>👥 Your Groups</h1>

        <button
          className="create-btn"
          onClick={() => setShowModal(true)}
        >
          + Create Group
        </button>
      </div>

      {/* GROUP CARDS */}
      <div className="groups-grid">

        {groups.map((group) => (
          <div
            key={group.$id}
            className="group-card"
            onClick={() =>
              navigate(`/app/groups/${group.$id}`)
            }
          >
            <h3>{group.name}</h3>
            <p>
              Created:{" "}
              {new Date(group.createdAt).toDateString()}
            </p>
          </div>
        ))}

      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">

            <h2>Create Group</h2>

            <input
              placeholder="Group name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <div className="modal-actions">
              <button
                className="cancel"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>

              <button
                className="create"
                onClick={handleCreateGroup}
              >
                Create
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default Groups;