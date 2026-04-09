import React, { useState, useEffect } from "react";

export default function ExpenseSplitter() {
  const [participants, setParticipants] = useState([]);
  const [newParticipant, setNewParticipant] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [payers, setPayers] = useState({});

  const addParticipant = () => {
    if (!newParticipant.trim()) return;
    if (participants.includes(newParticipant)) return;

    setParticipants([...participants, newParticipant]);
    setNewParticipant("");
  };

  const removeParticipant = (name) => {
    const updated = participants.filter((p) => p !== name);
    setParticipants(updated);

    const newPayers = { ...payers };
    delete newPayers[name];
    setPayers(newPayers);
  };

  // Auto-calculate total
  useEffect(() => {
    const total = Object.values(payers).reduce((sum, val) => sum + (val || 0), 0);
    setAmount(total ? total.toString() : "");
  }, [payers]);

  const addExpense = () => {
    const total = parseFloat(amount);
    if (!total || isNaN(total) || participants.length === 0) return;

    const split = {};
    const equalShare = total / participants.length;

    participants.forEach((p) => {
      split[p] = equalShare;
    });

    setExpenses([
      ...expenses,
      {
        id: Date.now(),
        description,
        amount: total,
        paidBy: payers,
        split,
      },
    ]);

    setDescription("");
    setAmount("");
    setPayers({});
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  const resetAll = () => {
    setExpenses([]);
    setParticipants([]);
    setPayers({});
    setAmount("");
    setDescription("");
  };

  const calculateBalances = () => {
    const balances = {};
    participants.forEach((p) => (balances[p] = 0));

    expenses.forEach((exp) => {
      Object.entries(exp.paidBy).forEach(([person, amt]) => {
        balances[person] += amt;
      });

      participants.forEach((p) => {
        balances[p] -= exp.split[p] || 0;
      });
    });

    return balances;
  };

  const simplifyDebts = () => {
    const balances = calculateBalances();

    const creditors = [];
    const debtors = [];

    Object.entries(balances).forEach(([person, amount]) => {
      if (amount > 0) creditors.push({ person, amount });
      else if (amount < 0) debtors.push({ person, amount: -amount });
    });

    const transactions = [];

    while (creditors.length && debtors.length) {
      const creditor = creditors[0];
      const debtor = debtors[0];

      const settled = Math.min(creditor.amount, debtor.amount);

      transactions.push(`${debtor.person} pays ${creditor.person} ₹${settled.toFixed(2)}`);

      creditor.amount -= settled;
      debtor.amount -= settled;

      if (creditor.amount === 0) creditors.shift();
      if (debtor.amount === 0) debtors.shift();
    }

    return transactions;
  };

  const balances = calculateBalances();
  const settlements = simplifyDebts();

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Smart Expense Splitter</h1>

      {/* Participants */}
      <div className="bg-white p-4 rounded-2xl shadow mb-4">
        <h2 className="font-semibold mb-2">Participants</h2>
        <div className="flex gap-2 mb-2">
          <input
            placeholder="Enter name"
            value={newParticipant}
            onChange={(e) => setNewParticipant(e.target.value)}
            className="border p-2 flex-1"
          />
          <button onClick={addParticipant} className="bg-green-500 text-white px-4 py-2 rounded">
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {participants.map((p) => (
            <div key={p} className="bg-gray-200 px-3 py-1 rounded flex items-center gap-2">
              {p}
              <button onClick={() => removeParticipant(p)} className="text-red-500">✕</button>
            </div>
          ))}
        </div>
      </div>

      {/* Add Expense */}
      <div className="bg-white p-4 rounded-2xl shadow mb-4">
        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 mr-2"
        />
        <input
          placeholder="Amount (auto-calculated)"
          value={amount}
          readOnly
          className="border p-2 mr-2 bg-gray-100"
        />

        <div className="mt-3">
          <h3 className="font-semibold">Who paid?</h3>
          {participants.map((p) => (
            <div key={p} className="flex items-center gap-2 mt-1">
              <span className="w-20">{p}</span>
              <input
                type="number"
                placeholder="0"
                value={payers[p] || ""}
                onChange={(e) =>
                  setPayers({ ...payers, [p]: Number(e.target.value) })
                }
                className="border p-1 w-24"
              />
            </div>
          ))}
        </div>

        <button onClick={addExpense} className="bg-blue-500 text-white px-4 py-2 rounded mt-3 mr-2">
          Add Expense
        </button>

        <button onClick={resetAll} className="bg-red-500 text-white px-4 py-2 rounded mt-3">
          Reset All
        </button>
      </div>

      {/* Expense History */}
      <div className="bg-white p-4 rounded-2xl shadow mb-4">
        <h2 className="font-semibold mb-2">Expense History</h2>
        {expenses.length === 0 && <div>No expenses yet</div>}
        {expenses.map((exp) => (
          <div key={exp.id} className="flex justify-between items-center border-b py-2">
            <div>
              <div className="font-medium">{exp.description || "No description"}</div>
              <div className="text-sm text-gray-600">₹{exp.amount.toFixed(2)}</div>
            </div>
            <button
              onClick={() => deleteExpense(exp.id)}
              className="text-red-500"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Balances */}
      <div className="bg-white p-4 rounded-2xl shadow mb-4">
        <h2 className="font-semibold mb-2">Balances</h2>
        {Object.entries(balances).map(([p, amt]) => (
          <div key={p}>
            {p}: ₹{amt.toFixed(2)}
          </div>
        ))}
      </div>

      {/* Settlements */}
      <div className="bg-white p-4 rounded-2xl shadow">
        <h2 className="font-semibold mb-2">Settlements</h2>
        {settlements.map((s, i) => (
          <div key={i}>{s}</div>
        ))}
      </div>
    </div>
  );
}
