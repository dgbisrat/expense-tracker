const balanceEl = document.querySelector('#balance');
const incomeAmountEl = document.querySelector('#income-amount');
const expenseAmountEl = document.querySelector('#expense-amount');
const transactionListEl = document.querySelector('#transaction-list');
const transactionFormEl = document.querySelector('#transaction-form');
const descriptionEl = document.querySelector('#description');
const amountEl = document.querySelector('#amount');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
transactionListEl.innerHTML = transactions

transactionFormEl.addEventListener('submit', addTransaction);

function addTransaction(e){
    e.preventDefault();

    //get the  form values 

    const description = descriptionEl.value.trim();
    const amount = parseFloat(amountEl.value);

    transactions.push({
        id: Date.now(),
        description: description,
        amount: amount
    });

    localStorage.setItem('transactions', JSON.stringify(transactions));
    console.log(localStorage);

    updateTransactionList();
    updateSummary();

    transactionFormEl.reset();
}


function updateTransactionList(){
    transactionListEl.innerHTML = '';
    const sortedTransactions = [...transactions].reverse();

    sortedTransactions.forEach(transaction => {
        const transactionEl = createTransactionElement(transaction);

        transactionListEl.appendChild(transactionEl)
    })
}

function createTransactionElement(transaction){
  const li = document.createElement("li");
  li.classList.add("transaction");
  li.classList.add(transaction.amount > 0 ? "income" : "expense");

  // todo: update the amount formating
  li.innerHTML = `
    <span>${transaction.description}</span>
    <span>
    ${formatCurrency(transaction.amount)}
    <button class="delete-btn" onclick = "removeTransaction(${transaction.id})">X</button>
    </span>
    `;

  return li;
}

function updateSummary(){
    const balance = transactions.reduce((acc, transaction) => acc + transaction.amount,0 );

    const income = transactions
      .filter((transaction) => transaction.amount > 0)
      .reduce((acc, transactions) => acc + transactions.amount, 0);

    const expenses = transactions
      .filter((transaction) => transaction.amount < 0)
      .reduce((acc, transactions) => acc + transactions.amount, 0);

    // update UI => fix the formatting  
    balanceEl.innerText = formatCurrency(balance);
    incomeAmountEl.textContent = formatCurrency(income);
    expenseAmountEl.textContent = formatCurrency(expenses);
}

function formatCurrency(number){
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(number);
}

function removeTransaction(id){
    transactions = transactions.filter(transaction => transaction.id !== id);

    localStorage.setItem('transactions', JSON.stringify(transactions));
    updateTransactionList();
    updateSummary();
}

updateTransactionList();
updateSummary();
// transactionListEl.innerHTML = JSON.parse(localStorage.getItem('transactions'))
