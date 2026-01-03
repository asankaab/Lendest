import { api } from './api';

export const dashboardLoader = async () => {
    // Fetch all transactions once, then calculate stats and chart data from it
    const transactions = await api.getTransactions();
    
    // Pass transactions to avoid re-fetching
    const [stats, chartData] = await Promise.all([
        api.getDashboardStats(transactions),
        api.getChartData(transactions)
    ]);
    
    // Return only recent transactions for display
    const recentTransactions = transactions.slice(0, 5);
    
    return { transactions: recentTransactions, stats, chartData };
};

export const peopleLoader = async () => {
    const [allPeople, transactions] = await Promise.all([
        api.getPeople(),
        api.getTransactions()
    ]);

    // Initialize map with all people
    const peopleMap = {};

    // 1. Add all existing people to the map
    allPeople.forEach(person => {
        peopleMap[person.username] = {
            id: person.username,
            name: person.name,
            username: person.username,
            balance: 0,
        };
    });

    // 2. Process transactions to calculate balances
    transactions.forEach(tx => {
        const name = tx.person_name;
        const username = tx.person_username || name.toLowerCase().replace(/\s+/g, '_');

        // Ensure person exists in map (legacy/fallback if not in people table)
        if (!peopleMap[username]) {
            peopleMap[username] = {
                id: username,
                name: name,
                username: username,
                balance: 0,
            };
        }

        const amount = parseFloat(tx.amount);
        if (tx.type === 'lend') {
            peopleMap[username].balance += amount;
        } else {
            peopleMap[username].balance -= amount;
        }
    });

    return Object.values(peopleMap);
};

export const personDetailsLoader = async ({ params }) => {
    const { username } = params;
    const user_id = decodeURIComponent(username);
    const txs = await api.getTransactionsByPerson(user_id);

    // Set display name from first transaction or username
    let personName = user_id;
    if (txs.length > 0) {
        personName = txs[0].person_name;
    }

    // Calculate balance
    const balance = txs.reduce((acc, tx) => {
        const amount = parseFloat(tx.amount);
        if (tx.type === 'lend') return acc + amount;
        if (tx.type === 'borrow') return acc - amount;
        if (tx.type === 'repayment') return acc - amount; // Repayment (received) reduces the positive balance (debt to me)
        if (tx.type === 'paid_back') return acc + amount; // Paid back (I paid) increases the positive balance (reduces debt I owe)
        return acc;
    }, 0);

    return { transactions: txs, balance, personName, username };
};

export const transactionsLoader = async () => {
    return await api.getTransactions();
};
