const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Endpoint auxiliar de evaluación para emitir JWT válidos desde Postman.
router.post('/token', authController.createToken);

module.exports = router;
