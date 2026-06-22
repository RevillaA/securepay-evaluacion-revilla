const Sentry = require('@sentry/node');
const { transactionService } = require('../services/transaction.monolith.service');

const SECUREPAY_CLUSTER_FAILURE_MESSAGE = 'Conexión interrumpida con el Clúster de Datos SecurePay';

class TransferController {
  constructor(transactionServiceInstance) {
    this.transactionService = transactionServiceInstance;
    this.executeTransfer = this.executeTransfer.bind(this);
  }

  executeTransfer(req, res, next) {
    try {
      const { fromAccountId, toAccountId, amount, simulateBalanceClusterFailure } = req.body;

      if (!fromAccountId || !toAccountId || amount === undefined) {
        return res.status(400).json({
          error: 'Petición incorrecta',
          message: 'Los campos fromAccountId, toAccountId y amount son requeridos en el cuerpo de la petición.'
        });
      }

      if (simulateBalanceClusterFailure === true) {
        const operationalError = new Error(SECUREPAY_CLUSTER_FAILURE_MESSAGE);
        operationalError.isOperational = true;
        throw operationalError;
      }

      const result = this.transactionService.executeTransfer(fromAccountId, toAccountId, Number(amount));
      return res.status(200).json(result);
    } catch (error) {
      if (error.isOperational) {
        const authenticatedUserId = req.user && req.user.sub ? req.user.sub : 'unknown';

        // El scope del request conserva la identidad afectada para que Sentry la reciba junto al evento 500.
        Sentry.setTag('affected_user_id', authenticatedUserId);
        Sentry.setUser({ id: authenticatedUserId });
        return next(error);
      }

      return res.status(400).json({
        error: 'Error en la transacción',
        message: error.message
      });
    }
  }
}

module.exports = new TransferController(transactionService);
