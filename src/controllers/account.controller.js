const { transactionService } = require('../services/transaction.monolith.service');

class AccountController {
  constructor(transactionServiceInstance) {
    this.transactionService = transactionServiceInstance;
    this.getBalance = this.getBalance.bind(this);
  }

  getBalance(req, res) {
    try {
      const accountId = req.query.accountId;
      const authenticatedUserId = req.user && req.user.sub;

      if (!accountId && !authenticatedUserId) {
        return res.status(400).json({
          error: 'Petición incorrecta',
          message: 'Debe proporcionar un parámetro accountId por query string o autenticarse con un token válido.'
        });
      }

      const accountInfo = accountId
        ? this.transactionService.getAccountBalance(accountId)
        : this.transactionService.getAccountBalanceByUserId(authenticatedUserId);

      return res.status(200).json(accountInfo);
    } catch (error) {
      return res.status(404).json({
        error: 'Recurso no encontrado',
        message: error.message
      });
    }
  }
}

module.exports = new AccountController(transactionService);
