class TransactionStateStoreService {
  constructor(transactionsHistory) {
    this.transactionsHistory = transactionsHistory;
  }

  createTransactionRecord({ fromAccountId, toAccountId, amount }) {
    return {
      transactionId: `TX-${Date.now()}-${Math.random().toString(36).slice(2, 11).toUpperCase()}`,
      from: fromAccountId,
      to: toAccountId,
      amount,
      status: 'COMPLETED',
      timestamp: new Date().toISOString()
    };
  }

  saveTransaction(transaction) {
    this.transactionsHistory.push(transaction);
    return transaction;
  }
}

module.exports = TransactionStateStoreService;
