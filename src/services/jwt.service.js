const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const PRIVATE_KEY_PATH = path.join(__dirname, '../../private.pem');
const PUBLIC_KEY_PATH = path.join(__dirname, '../../public.pem');

function readKey(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function buildSecurePayload(user) {
  if (!user || !user.id) {
    throw new Error('No se puede firmar el token: falta el identificador del usuario.');
  }

  const name = user.name || user.email || user.id;
  return {
    sub: user.id,
    name
  };
}

/**
 * Firma un JWT asimétrico con una expiración corta para el intercambio entre servicios.
 */
function signToken(user) {
  const privateKey = readKey(PRIVATE_KEY_PATH);
  const payload = buildSecurePayload(user);

  return jwt.sign(payload, privateKey, {
    algorithm: 'RS256',
    expiresIn: '2m'
  });
}

/**
 * Verifica un JWT utilizando únicamente la llave pública del servicio consumidor.
 */
function verifyToken(token) {
  const publicKey = readKey(PUBLIC_KEY_PATH);

  return jwt.verify(token, publicKey, {
    algorithms: ['RS256']
  });
}

module.exports = {
  signToken,
  verifyToken
};
