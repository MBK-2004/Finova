export const calculateBalances = (expenses) => {
  const balances = {};

  expenses.forEach((expense) => {
    const amount = Number(expense.amount) || 0;

    let splitBetween = expense.splitBetween;

    if (typeof splitBetween === "string") {
      try {
        splitBetween = JSON.parse(splitBetween);
      } catch {
        splitBetween = splitBetween
          .split(",")
          .map((m) => m.trim())
          .filter(Boolean);
      }
    }

    if (!Array.isArray(splitBetween) || splitBetween.length === 0) {
      return;
    }

    const share = amount / splitBetween.length;

    balances[expense.paidBy] =
      (balances[expense.paidBy] || 0) + amount;

    splitBetween.forEach((member) => {
      balances[member] =
        (balances[member] || 0) - share;
    });
  });

  return balances;
};