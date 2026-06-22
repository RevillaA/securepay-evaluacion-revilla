const jwtService = require('../services/jwt.service');
const { usersDb } = require('../services/transaction.data.store');

class AuthController {
  constructor(jwtServiceInstance, usersStore) {
    this.jwtService = jwtServiceInstance;
    this.usersStore = usersStore;
    this.createToken = this.createToken.bind(this);
  }

  createToken(req, res) {
    try {
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({
          error: 'Petición incorrecta',
          message: 'Debe proporcionar el campo userId en el cuerpo de la petición.'
        });
      }

      const user = this.usersStore.find((storedUser) => storedUser.id === userId);
      if (!user) {
        return res.status(404).json({
          error: 'Recurso no encontrado',
          message: `No existe un usuario registrado con el id '${userId}'.`
        });
      }

      const token = this.jwtService.signToken(user);

      return res.status(200).json({
        message: 'Token generado con éxito',
        token,
        expiresIn: '2m',
        user: {
          id: user.id,
          email: user.email,
          accountId: user.accountAlpha
        }
      });
    } catch (error) {
      return res.status(500).json({
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }
}

module.exports = new AuthController(jwtService, usersDb);
