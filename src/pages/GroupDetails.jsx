import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import databaseService from "../appwrite/database";
import authService from "../appwrite/auth";

import { calculateBalances } from "../utils/expenseCalculator";

import "./GroupDetail.css";

function GroupDetails() {

  const { id } = useParams();
   const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState({});
  const [currentUser, setCurrentUser] = useState(null);

  const [showExpenseModal, setShowExpenseModal] = useState(false);

  const [expenseForm, setExpenseForm] = useState({
  title: "",
  amount: "",
  paidBy: "",
  splitBetween: "",
  category: "Food",
});

  const loadData = async () => {
    try {
      const user = await authService.getCurrentUser();
      setCurrentUser(user);

      const groups = await databaseService.getGroups(user.$id);

      const currentGroup = groups.documents.find(
        (g) => g.$id === id
      );

      setGroup(currentGroup);

      const exp = await databaseService.getExpenses(id);
      const allExpenses = exp.documents || [];

      const activeExpenses = allExpenses.filter(
        (e) => !e.settled
      );

      setExpenses(activeExpenses);
      setBalances(calculateBalances(activeExpenses));

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // AUTO RECALCULATE WHEN EXPENSES CHANGE
 useEffect(() => {
  const result = calculateBalances(expenses);

  console.log("CALCULATED BALANCES:", result);

  setBalances(result);
}, [expenses]);

  const handleAddExpense = async () => {
  if (
    !expenseForm.title ||
    !expenseForm.amount ||
    !expenseForm.paidBy ||
    !expenseForm.splitBetween
  ) {
    alert("Please fill all fields");
    return;
  }

  const normalize = (name) =>
    name.trim().toLowerCase();

  const splitArray = expenseForm.splitBetween
    .split(",")
    .map((m) => normalize(m))
    .filter(Boolean);

  if (splitArray.length < 2) {
    alert(
      "Enter at least 2 members separated by commas.\nExample: aai,papa,siddhesh,maheshwari"
    );
    return;
  }

  try {
   await databaseService.createExpense({
  title: expenseForm.title,
  amount: Number(expenseForm.amount),
  paidBy: normalize(expenseForm.paidBy),
  splitBetween: splitArray,
  category: expenseForm.category,
  groupId: id,
});
   setExpenseForm({
  title: "",
  amount: "",
  paidBy: "",
  splitBetween: "",
  category: "Food",
});
    setShowExpenseModal(false);

    loadData();
  } catch (error) {
    console.log(error);
  }
};

const handleDeleteGroup = async () => {
  const confirmDelete = window.confirm(
    "Delete this group?"
  );

  if (!confirmDelete) return;

  try {
    await databaseService.deleteGroup(id);

    navigate("/app/groups");
  } catch (error) {
    console.log(error);
  }
};

  if (!group) return <h2>Loading...</h2>;

  return (
    <div className="group-page">

    <div className="group-header">
  <div>
    <h1>{group.name}</h1>
    <p>Manage shared expenses</p>
  </div>

  <div className="header-actions">

    <button
      className="add-expense-btn"
      onClick={() => setShowExpenseModal(true)}
    >
      + Add Expense
    </button>

    <button
      className="delete-group-btn"
      onClick={handleDeleteGroup}
    >
      🗑 Delete Group
    </button>

  </div>
</div>

      <div className="group-grid">

        <div className="left-column">

          <div className="card">

            <h3>Expenses</h3>

            {expenses.length === 0 ? (
              <div>No expenses yet</div>
            ) : (
            expenses.map((e) => (
  <div key={e.$id} className="expense-card">

    <div className="expense-left">
      <div className="expense-icon">💸</div>

      <div>
        <h4>{e.title}</h4>
        <p>Paid by {e.paidBy}</p>
      </div>
    </div>

    <div className="expense-right">
      <h3>₹{e.amount}</h3>

      <div className="expense-actions">

        <button
          className="action-btn settle"
          onClick={() => handleSettleExpense(e.$id)}
        >
          ✓
        </button>

        <button
          className="action-btn delete"
          onClick={() => handleDeleteExpense(e.$id)}
        >
          🗑
        </button>

      </div>
    </div>

  </div>
))
            )}

          </div>
        </div>

        <div className="right-column">

          <div className="card">
            <h3>Balance Summary</h3>

            {Object.keys(balances).length === 0 ? (
              <div>Everyone is settled 🎉</div>
            ) : (
              Object.entries(balances).map(([person, amount]) => (
                <div key={person}>
                  {amount >= 0
                    ? `${person} gets ₹${amount.toFixed(0)}`
                    : `${person} owes ₹${Math.abs(amount).toFixed(0)}`
                  }
                </div>
              ))
            )}

          </div>

        </div>

      </div>

      {/* MODAL (same as yours) */}
      {showExpenseModal && (
        <div className="modal-overlay">
          <div className="expense-modal">

            <h2>Add Expense</h2>

            <input
              placeholder="Title"
              value={expenseForm.title}
              onChange={(e) =>
                setExpenseForm({ ...expenseForm, title: e.target.value })
              }
            />

           <input
  placeholder="Amount"
  type="number"
  value={expenseForm.amount}
  onChange={(e) =>
    setExpenseForm({ ...expenseForm, amount: e.target.value })
  }
/>

<select
  value={expenseForm.category}
  onChange={(e) =>
    setExpenseForm({
      ...expenseForm,
      category: e.target.value,
    })
  }
>
  <option value="Food">🍔 Food</option>
  <option value="Travel">✈️ Travel</option>
  <option value="Shopping">🛒 Shopping</option>
  <option value="Bills">🏠 Bills</option>
  <option value="Other">📦 Other</option>
</select>

<input
  placeholder="Paid By"
  value={expenseForm.paidBy}
  onChange={(e) =>
    setExpenseForm({ ...expenseForm, paidBy: e.target.value })
  }
/>

            <input
  placeholder="Enter names separated by commas: aai,papa,siddhesh,maheshwari"
  value={expenseForm.splitBetween}
  onChange={(e) =>
    setExpenseForm({ ...expenseForm, splitBetween: e.target.value })
  }
/>

          <div className="modal-actions">
  <button onClick={handleAddExpense}>
    Save
  </button>

  <button onClick={() => setShowExpenseModal(false)}>
    Cancel
  </button>
</div>

          </div>
        </div>
      )}

    </div>
  );
}

export default GroupDetails;