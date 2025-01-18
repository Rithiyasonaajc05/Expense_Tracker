// Expense class
class Expense {
  constructor(amount, category, date) {
    this.amount = amount;
    this.category = category;
    this.date = new Date(date); // Date object for filtering
  }
}

// User class
class User {
  constructor(name, income) {
    this.name = name;
    this.income = income;
    this.expenses = []; // Array to track all expenses
    this.categories = {}; // Hash map to categorize expenses
  }

  // Add an expense
  addExpense(amount, category, date) {
    const expense = new Expense(amount, category, date);
    this.expenses.push(expense);

    // Update category-wise total
    if (this.categories[category]) {
      this.categories[category] += amount;
    } else {
      this.categories[category] = amount;
    }

    console.log(`Expense added: ${amount} in category ${category}`);
  }

  // Analyze expenses
  analyzeExpenses() {
    const totalSpent = this.expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const savings = this.income - totalSpent;

    return {
      totalSpent,
      savings,
      categoryBreakdown: this.categories,
    };
  }

  // Filter expenses by month
  filterByMonth(month, year) {
    return this.expenses.filter(
      (expense) =>
        expense.date.getMonth() + 1 === month && expense.date.getFullYear() === year
    );
  }

  // Filter expenses by category
  filterByCategory(category) {
    return this.expenses.filter((expense) => expense.category === category);
  }
}

// Budget class
class Budget {
  constructor(limit) {
    this.limit = limit;
  }

  // Check if the budget is exceeded
  checkBudget(totalSpent) {
    if (totalSpent > this.limit) {
      console.warn("Budget exceeded!");
      return false;
    }
    return true;
  }
}

// Example Usage
const user = new User("Alice", 5000); // User with $5000 monthly income
const budget = new Budget(4000); // Set a budget of $4000

// Add expenses
user.addExpense(500, "Food", "2025-01-01");
user.addExpense(1200, "Rent", "2025-01-02");
user.addExpense(300, "Entertainment", "2025-01-03");
user.addExpense(800, "Utilities", "2025-01-05");

// Analyze expenses
const { totalSpent, savings, categoryBreakdown } = user.analyzeExpenses();
console.log("Total Spent:", totalSpent);
console.log("Savings:", savings);
console.log("Category Breakdown:", categoryBreakdown);

// Check budget
budget.checkBudget(totalSpent);

// Filter expenses by month
const januaryExpenses = user.filterByMonth(1, 2025);
console.log("Expenses in January 2025:", januaryExpenses);

// Filter expenses by category
const foodExpenses = user.filterByCategory("Food");
console.log("Food Expenses:", foodExpenses);
