// Example data to simulate transactions
let transactions = [
    { id: 1, amount: 500, category: "Food", description: "Groceries", timestamp: "2025-01-15 10:00:00" },
    { id: 2, amount: 100, category: "Transport", description: "Bus Fare", timestamp: "2025-01-16 12:00:00" },
    { id: 3, amount: 200, category: "Bills", description: "Electricity Bill", timestamp: "2025-01-20 14:30:00" }
];

// Show specific sections
function showSection(sectionId) {
    const sections = document.querySelectorAll("section");
    sections.forEach(section => section.classList.add("hidden"));
    document.getElementById(sectionId).classList.remove("hidden");
}

// Event handlers for showing different sections
function showAddTransaction() {
    showSection("add-transaction");
}

function showViewTransactions() {
    showSection("view-transactions");
    displayTransactions();
}

function showExpenseSummary() {
    showSection("expense-summary");
    displayExpenseSummary();
}

function showFilterTransactions() {
    showSection("filter-transactions");
}

function showDeleteTransaction() {
    showSection("delete-transaction");
}

// Display transactions in the table
function displayTransactions() {
    const tableBody = document.getElementById("transactionTable").getElementsByTagName("tbody")[0];
    tableBody.innerHTML = ''; // Clear previous data
    transactions.forEach((transaction, index) => {
        const row = tableBody.insertRow();
        row.insertCell(0).innerText = index + 1;
        row.insertCell(1).innerText = transaction.timestamp;
        row.insertCell(2).innerText = `₹${transaction.amount}`;
        row.insertCell(3).innerText = transaction.category;
        row.insertCell(4).innerText = transaction.description;
    });
}

// Display the expense summary
function displayExpenseSummary() {
    const summaryList = document.getElementById("summaryList");
    summaryList.innerHTML = ''; // Clear previous data

    const summary = {};
    transactions.forEach(transaction => {
        if (!summary[transaction.category]) {
            summary[transaction.category] = 0;
        }
        summary[transaction.category] += transaction.amount;
    });

    for (const category in summary) {
        const listItem = document.createElement("li");
        listItem.innerText = `${category}: ₹${summary[category]}`;
        summaryList.appendChild(listItem);
    }
}

// Handle the filter form submission
document.getElementById("filterForm").addEventListener("submit", function(e) {
    e.preventDefault();
    
    const category = document.getElementById("categoryFilter").value.trim();
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;
    const minAmount = parseFloat(document.getElementById("minAmount").value) || 0;
    const maxAmount = parseFloat(document.getElementById("maxAmount").value) || Infinity;
    
    console.log("Filter form submitted with:", { category, startDate, endDate, minAmount, maxAmount });
    
    filterTransactions(category, startDate, endDate, minAmount, maxAmount);
});

// Filter transactions based on user input
function filterTransactions(category, startDate, endDate, minAmount, maxAmount) {
    console.log("Filtering transactions with:", { category, startDate, endDate, minAmount, maxAmount });

    let filtered = [...transactions]; // Make a copy of the transactions array

    // Filter by category
    if (category) {
        filtered = filtered.filter(t => t.category.toLowerCase().includes(category.toLowerCase()));
    }

    // Filter by date range
    if (startDate || endDate) {
        filtered = filtered.filter(t => {
            const transactionDate = new Date(t.timestamp);
            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;

            return (!start || transactionDate >= start) && (!end || transactionDate <= end);
        });
    }

    // Filter by amount range
    filtered = filtered.filter(t => t.amount >= minAmount && t.amount <= maxAmount);

    // If no results match, show a message
    if (filtered.length === 0) {
        alert("No transactions match the filter criteria.");
    } else {
        console.log("Filtered transactions:", filtered);
        displayFilteredTransactions(filtered);
    }
}

// Display the filtered transactions
function displayFilteredTransactions(filtered) {
    const tableBody = document.getElementById("transactionTable").getElementsByTagName("tbody")[0];
    tableBody.innerHTML = ''; // Clear previous data

    filtered.forEach((transaction, index) => {
        const row = tableBody.insertRow();
        row.insertCell(0).innerText = index + 1;
        row.insertCell(1).innerText = transaction.timestamp;
        row.insertCell(2).innerText = `₹${transaction.amount}`;
        row.insertCell(3).innerText = transaction.category;
        row.insertCell(4).innerText = transaction.description;
    });
}

// Handle adding a transaction
document.getElementById("addTransactionForm").addEventListener("submit", function(e) {
    e.preventDefault();
    
    const amount = parseFloat(document.getElementById("amount").value);
    const category = document.getElementById("category").value;
    const description = document.getElementById("description").value;
    
    if (amount <= 0 || !category || !description) {
        alert("Please provide valid input.");
        return;
    }

    const newTransaction = {
        id: transactions.length + 1,
        amount,
        category,
        description,
        timestamp: new Date().toISOString()
    };

    transactions.push(newTransaction);
    alert("Transaction added successfully!");
    showViewTransactions();
});

// Handle deleting a transaction
document.getElementById("deleteForm").addEventListener("submit", function(e) {
    e.preventDefault();
    
    const transactionId = parseInt(document.getElementById("transactionId").value);
    transactions = transactions.filter(t => t.id !== transactionId);
    alert("Transaction deleted successfully!");
    showViewTransactions();
});
