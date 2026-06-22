const jwtService = require('../services/jwt.service');

/**
 * Valida el Bearer Token de forma autónoma con la llave pública del microservicio.
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      error: 'Acceso no autorizado',
      message: 'Falta la cabecera Authorization en la petición.'
    });
  }

  const [scheme, token] = authHeader.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({
      error: 'Acceso no autorizado',
      message: 'Formato de cabecera de autenticación debe ser Bearer <token>.'
    });
  }

  try {
    const decodedToken = jwtService.verifyToken(token);
    req.user = decodedToken;
    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({
        error: 'Token expirado',
        message: 'El token ya no es válido porque superó el tiempo de expiración permitido.'
      });
    }

    return res.status(401).json({
      error: 'Token inválido',
      message: 'No fue posible validar la autenticidad del token recibido.'
    });
  }
}

module.exports = authMiddleware;
