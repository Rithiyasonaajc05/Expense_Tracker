class User {
    constructor(name, budget) {
      this.name = name;
      this.budget = budget;
      this.expenses = [];
    }
  
    addExpense(expense) {
      this.expenses.push(expense);
    }
  
    deleteExpense(expenseId) {
      this.expenses = this.expenses.filter(exp => exp.id !== expenseId);
    }
  
    analyzeExpenses() {
      let totalSpent = 0;
      const categorySpending = {};
  
      this.expenses.forEach(exp => {
        totalSpent += exp.amount;
        categorySpending[exp.category] = (categorySpending[exp.category] || 0) + exp.amount;
      });
  
      const remainingBudget = this.budget - totalSpent;
  
      return { totalSpent, remainingBudget, categorySpending };
    }
  }
  
  class Expense {
    static idCounter = 1;
  
    constructor(amount, date, category) {
      this.id = Expense.idCounter++;
      this.amount = amount;
      this.date = date;
      this.category = category;
    }
  }
  
  // Initialize User
  let user = new User("Alice", 0);
  
  // Update Budget
  function setBudget() {
    const budgetInput = document.getElementById("budgetInput").value;
    user.budget = parseFloat(budgetInput);
    updateUI();
  }
  
  // Add Expense
  function addExpense() {
    const amount = parseFloat(document.getElementById("expenseAmount").value);
    const date = document.getElementById("expenseDate").value;
    const category = document.getElementById("expenseCategory").value;
  
    if (amount && date && category) {
      const expense = new Expense(amount, date, category);
      user.addExpense(expense);
      updateUI();
    }
  }
  
  // Update UI
  function updateUI() {
    // Update Budget Status
    const { totalSpent, remainingBudget, categorySpending } = user.analyzeExpenses();
    document.getElementById("budgetAmount").innerText = user.budget;
    document.getElementById("totalSpent").innerText = totalSpent;
    document.getElementById("remainingBudget").innerText = remainingBudget;
  
    // Update Expense List
    const expenseList = document.getElementById("expenseList");
    expenseList.innerHTML = "";
    user.expenses.forEach(exp => {
      const li = document.createElement("li");
      li.textContent = `${exp.date} - ${exp.category}: $${exp.amount}`;
      expenseList.appendChild(li);
    });
  
    // Update Chart
    updateChart(categorySpending);
  }
  
  // Update Chart
  function updateChart(data) {
    const ctx = document.getElementById("expenseChart").getContext("2d");
  
    const labels = Object.keys(data);
    const values = Object.values(data);
  
    new Chart(ctx, {
      type: "pie",
      data: {
        labels: labels,
        datasets: [
          {
            data: values,
            backgroundColor: [
              "rgba(255, 99, 132, 0.6)",
              "rgba(54, 162, 235, 0.6)",
              "rgba(255, 206, 86, 0.6)",
              "rgba(75, 192, 192, 0.6)",
              "rgba(153, 102, 255, 0.6)",
            ],
          },
        ],
      },
      options: {
        responsive: true,
      },
    });
  }
  