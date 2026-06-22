class FinancialVerificationService {
  constructor(usersDb) {
    this.usersDb = usersDb;
  }

  findAccountById(accountId) {
    return this.usersDb.find((user) => user.accountAlpha === accountId);
  }

  findAccountByUserId(userId) {
    return this.usersDb.find((user) => user.id === userId);
  }

  validateTransfer(fromAccountId, toAccountId, amount) {
    const sender = this.findAccountById(fromAccountId);
    if (!sender) {
      throw new Error(`Error de validación: La cuenta origen '${fromAccountId}' no existe en la base de datos.`);
    }

    const receiver = this.findAccountById(toAccountId);
    if (!receiver) {
      throw new Error(`Error de validación: La cuenta destino '${toAccountId}' no existe en la base de datos.`);
    }

    if (amount <= 0) {
      throw new Error('Error de validación: El monto a transferir debe ser mayor a cero.');
    }

    if (sender.balance < amount) {
      throw new Error(`Saldo insuficiente: La cuenta '${fromAccountId}' tiene $${sender.balance}, requiere $${amount}.`);
    }

    return { sender, receiver };
  }

  applyTransfer(sender, receiver, amount) {
    sender.balance -= amount;
    receiver.balance += amount;

    return {
      senderBalance: sender.balance,
      receiverBalance: receiver.balance
    };
  }

  getAccountBalance(accountId) {
    const account = this.findAccountById(accountId);
    if (!account) {
      throw new Error(`La cuenta '${accountId}' no existe.`);
    }

    return {
      accountId: account.accountAlpha,
      email: account.email,
      balance: account.balance
    };
  }

  getAccountBalanceByUserId(userId) {
    const account = this.findAccountByUserId(userId);
    if (!account) {
      throw new Error(`El usuario '${userId}' no tiene una cuenta asociada.`);
    }

    return {
      accountId: account.accountAlpha,
      email: account.email,
      balance: account.balance
    };
  }
}

module.exports = FinancialVerificationService;
