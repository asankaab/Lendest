export const currencyValues = [
        { code: 'USD', name: 'US Dollar', symbol: '$' },
        { code: 'EUR', name: 'Euro', symbol: '€' },
        { code: 'GBP', name: 'British Pound', symbol: '£' },
        { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
        { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
        { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
        { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
        { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
        { code: 'MXN', name: 'Mexican Peso', symbol: '$' },
        { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
        { code: 'LKR', name: 'Sri Lankan Rupee', symbol: 'Rs' }
    ];

export const formatCurrency = (amount, currencyCode = 'USD') => {
    const symbol = getCurrencySymbol(currencyCode);
    const formatted = parseFloat(amount).toFixed(2);
    
    // For JPY, don't show decimal places
    if (currencyCode === 'JPY') {
        return `${symbol}${Math.round(amount).toLocaleString()}`;
    }
    
    return `${symbol}${parseFloat(formatted).toLocaleString()}`;
};

export const getCurrencySymbol = (currencyCode = 'USD') => {
    const currency = currencyValues.find(c => c.code === currencyCode);
    return currency ? currency.symbol : '$';
};
