const FinancialVerificationService = require('./financial-verification.service');
const TransactionStateStoreService = require('./transaction-state.store.service');
const ConsoleNotificationService = require('./console-notification.service');
const { usersDb, transactionsHistory } = require('./transaction.data.store');

class TransactionService {
  constructor(financialVerificationService, transactionStateStoreService, consoleNotificationService) {
    this.financialVerificationService = financialVerificationService;
    this.transactionStateStoreService = transactionStateStoreService;
    this.consoleNotificationService = consoleNotificationService;
  }

  executeTransfer(fromAccountId, toAccountId, amount) {
    const { sender, receiver } = this.financialVerificationService.validateTransfer(
      fromAccountId,
      toAccountId,
      amount
    );

    this.financialVerificationService.applyTransfer(sender, receiver, amount);

    // El orquestador mantiene el caso de uso y delega los detalles técnicos.
    const transaction = this.transactionStateStoreService.saveTransaction(
      this.transactionStateStoreService.createTransactionRecord({ fromAccountId, toAccountId, amount })
    );

    this.consoleNotificationService.notifyTransferCompleted({
      sender,
      receiver,
      fromAccountId,
      amount
    });

    return {
      success: true,
      message: 'Transferencia ejecutada con éxito',
      transaction,
      balanceRestante: sender.balance
    };
  }

  getAccountBalance(accountId) {
    return this.financialVerificationService.getAccountBalance(accountId);
  }

  getAccountBalanceByUserId(userId) {
    return this.financialVerificationService.getAccountBalanceByUserId(userId);
  }
}

const financialVerificationService = new FinancialVerificationService(usersDb);
const transactionStateStoreService = new TransactionStateStoreService(transactionsHistory);
const consoleNotificationService = new ConsoleNotificationService();

const transactionService = new TransactionService(
  financialVerificationService,
  transactionStateStoreService,
  consoleNotificationService
);

module.exports = {
  TransactionService,
  transactionService,
  financialVerificationService,
  transactionStateStoreService,
  consoleNotificationService,
  usersDb,
  transactionsHistory
};
