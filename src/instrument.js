require('dotenv').config();

const Sentry = require('@sentry/node');
const env = require('./config/env');

Sentry.init({
  dsn: env.sentryDsn,
  dataCollection: {
    // Se conserva el comportamiento por defecto para capturar el contexto mínimo útil del request.
  }
});

module.exports = Sentry;
