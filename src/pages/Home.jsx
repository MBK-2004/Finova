import React, { useEffect, useState } from "react";
import authService from "../appwrite/auth";
import databaseService from "../appwrite/database";
import { useNavigate } from "react-router-dom";
import "./home.css";
import { calculateBalances } from "../utils/expenseCalculator";

function Home() {
  const [user, setUser] = useState(null);
  const [groups, setGroups] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      if (!currentUser) return;

      const g = await databaseService.getGroups(currentUser.$id);
      setGroups(g.documents || []);

      const e = await databaseService.getAllExpenses();
      const allExpenses = e.documents || [];

      const activeExpenses = allExpenses.filter((exp) => !exp.settled);

      setExpenses(activeExpenses);
      setBalances(calculateBalances(activeExpenses));

    } catch (err) {
      console.log(err);
    }
  };
 

 const currentBalance =
  balances[user?.name?.trim().toLowerCase()] || 0;
  console.log("User:", user);
console.log("User Name:", user?.name);
console.log("Balances:", balances);
console.log("Current Balance:", currentBalance);

  const totalOwe = currentBalance < 0 ? Math.abs(currentBalance) : 0;
  const totalGet = currentBalance > 0 ? currentBalance : 0;

  return (
    <div className="home-page">

      <div className="home-top">
        <h1>Welcome back, {user?.name} 👋</h1>
        <p>Track shared expenses easily</p>
      </div>

   <div className="balance-row">

 

  <div className="balance-card owe">
    <h3>You Owe</h3>
    <h2>₹{totalOwe.toFixed(0)}</h2>
  </div>

  <div className="balance-card get">
    <h3>You Get</h3>
    <h2>₹{totalGet.toFixed(0)}</h2>
  </div>

</div>

      <div className="section">

        <div className="section-header">
          <h2>Your Groups</h2>
          <button onClick={() => navigate("/app/groups")}>
            + New Group
          </button>
        </div>

        <div className="groups-grid">

          {groups.length === 0 ? (
            <div className="empty-card">No groups yet</div>
          ) : (
            groups.map((group) => (
              <div
                key={group.$id}
                className="group-card"
                onClick={() =>
                  navigate(`/app/groups/${group.$id}`)
                }
              >
                <div>👥</div>
                <div>
                  <h3>{group.name}</h3>
                  <p>Tap to view</p>
                </div>
              </div>
            ))
          )}

        </div>
      </div>

      <div className="section">

        <div className="section-header">
          <h2>Recent Expenses</h2>
        </div>

        <div className="expense-list">

          {expenses.length === 0 ? (
            <div className="empty-card">No expenses yet</div>
          ) : (
            expenses
              .slice()
              .reverse()
              .slice(0, 5)
              .map((e) => (
                <div key={e.$id} className="expense-item">

                  <div>
                    <div className="expense-title">{e.title}</div>

                    {e.category && (
                      <div className="expense-category">
                        {e.category}
                      </div>
                    )}

                    <div className="expense-sub">
                      Paid by {e.paidBy}
                    </div>
                  </div>

                  <div>
                    ₹{e.amount}
                  </div>

                </div>
              ))
          )}

        </div>
      </div>

    </div>
  );
}

export default Home;