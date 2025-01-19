//ExpenseTracker
class ExpenseTracker {
  constructor() {
      this.income = new Map(); // Map to store income per month
      this.budget = new Map(); // Map to store budget per month
      this.expenses = []; // Stores all expenses
      this.monthlyExpenses = new Map(); // Stores monthly expense data
  }

  // Set income for a specific month
  setIncome(amount) {
      const selectedMonth = document.getElementById('month').value;
      this.income.set(selectedMonth, parseFloat(amount) || 0);
      this.updateOverview();
  }

  // Set budget for a specific month
  setBudget(amount) {
      const selectedMonth = document.getElementById('month').value;
      this.budget.set(selectedMonth, parseFloat(amount) || 0);
      this.updateOverview();
  }

  // Add an expense
  addExpense(category, amount, date) {
      if (!amount || !date) {
          alert("Please enter a valid expense amount and date.");
          return;
      }

      const expense = { category, amount: parseFloat(amount), date: new Date(date) };
      this.expenses.push(expense);

      // Update monthly expenses map
      const month = this.getMonthKey(expense.date);
      if (!this.monthlyExpenses.has(month)) {
          this.monthlyExpenses.set(month, []);
      }
      this.monthlyExpenses.get(month).push(expense);

      alert(`Expense of $${amount} added under ${category} for ${month}.`);
      this.updateOverview();
      this.updateExpenseList();
  }

  // Calculate total expenses for a given month
  getMonthlyExpenses(month) {
      if (!this.monthlyExpenses.has(month)) return 0;
      return this.monthlyExpenses
          .get(month)
          .reduce((total, expense) => total + expense.amount, 0);
  }
  // Calculate total income and savings
  // Calculate total income and savings
  calculateTotals() {
      let totalIncome = Array.from(this.income.values()).reduce((sum, value) => sum + value, 0); // Sum of all incomes
      let totalExpenses = 0;

      this.monthlyExpenses.forEach((expenses) => {
          totalExpenses += expenses.reduce((sum, expense) => sum + expense.amount, 0);
      });

      const totalSavings = totalIncome - totalExpenses;
      return { totalIncome, totalSavings };
  }

  updateTotalIncomeSavingsChart() {
      const totals = this.calculateTotals(); // Get updated totals
      const ctx = document.getElementById('totalIncomeSavingsChart').getContext('2d');
  
      const data = {
          labels: ['Total Income', 'Total Savings'],
          datasets: [{
              label: 'Amount ($)',
              data: [totals.totalIncome, totals.totalSavings], // Use calculated totals
              backgroundColor: ['#36A2EB', '#8BC34A']
          }]
      };
  
      if (!this.totalChart) {
          this.totalChart = new Chart(ctx, {
              type: 'bar',
              data: data,
              options: {
                  responsive: true,
                  plugins: {
                      legend: {
                          display: false
                      }
                  },
                  scales: {
                      y: {
                          beginAtZero: true
                      }
                  }
              }
          });
      } else {
          this.totalChart.data = data; // Update chart data
          this.totalChart.update();
      }
  }
  // Update the list of expenses for the selected month
  updateExpenseList() {
      const selectedMonth = document.getElementById('month').value;
      const expenseList = document.getElementById('expenseList');
      expenseList.innerHTML = ''; // Clear the list
  
      if (this.monthlyExpenses.has(selectedMonth)) {
          const expenses = this.monthlyExpenses.get(selectedMonth);
          expenses.forEach(expense => {
              const li = document.createElement('li');
              li.textContent = `${expense.date.toLocaleDateString()} - ${expense.category}: $${expense.amount.toFixed(2)}`;
              expenseList.appendChild(li);
          });
      } else {
          const li = document.createElement('li');
          li.textContent = 'No expenses for this month.';
          expenseList.appendChild(li);
      }
  }

  


  // Update the Overview Section
  updateOverview() {
      const selectedMonth = document.getElementById('month').value;

      // Get income and budget for the selected month
      const income = this.income.get(selectedMonth) || 0;
      const budget = this.budget.get(selectedMonth) || 0;

      // Get total expenses for the selected month
      const totalExpense = this.getMonthlyExpenses(selectedMonth);

      // Update the DOM
      document.getElementById('incomeAmount').innerText = income.toFixed(2);
      document.getElementById('budgetAmount').innerText = budget.toFixed(2);
      document.getElementById('expenseAmount').innerText = totalExpense.toFixed(2);
      document.getElementById('savingsAmount').innerText = (income - totalExpense).toFixed(2);

      // Update the chart
      this.updateChart(selectedMonth);
      this.updateTotalIncomeSavingsChart();

       this.updateExpenseList();
  }

  // Generate a unique month key for Map (e.g., "Jan-2025")
  getMonthKey(date) {
      const monthNames = [
          'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ];
      return `${monthNames[date.getMonth()]}-${date.getFullYear()}`;
  }

  // Update the Chart.js graph
  updateChart(month) {
      const categories = ['Food', 'Transport', 'Entertainment', 'Other'];
      const categoryTotals = categories.map((category) =>
          (this.monthlyExpenses.get(month) || [])
              .filter((expense) => expense.category === category)
              .reduce((total, expense) => total + expense.amount, 0)
      );

      if (!this.chart) {
          const ctx = document.getElementById('overviewChart').getContext('2d');
          this.chart = new Chart(ctx, {
              type: 'pie',
              data: {
                  labels: categories,
                  datasets: [{
                      data: categoryTotals,
                      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#8BC34A'],
                  }]
              }
          });
      } else {
          this.chart.data.datasets[0].data = categoryTotals;
          this.chart.update();
      }
  }
}


// Initialize ExpenseTracker object
const tracker = new ExpenseTracker();

// Event Handlers
function setIncome() {
  const incomeInput = document.getElementById('incomeInput').value;
  tracker.setIncome(incomeInput);
}

function setBudget() {
  const budgetInput = document.getElementById('budgetInput').value;
  tracker.setBudget(budgetInput);
}


function addExpense() {
  const category = document.getElementById('expenseCategory').value;
  const amount = document.getElementById('expenseAmount1').value;
  const date = document.getElementById('expenseDate').value;

  if (!category || !amount || !date) {
      alert("Please fill in all the fields before adding an expense.");
      return;
  }

  tracker.addExpense(category, amount, date);

  // Clear input fields after adding an expense
  document.getElementById('expenseAmount1').value = '';
  document.getElementById('expenseDate').value = '';
}

// Update overview when month changes
document.getElementById('month').addEventListener('change', () => tracker.updateOverview());

