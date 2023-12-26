const { body } = require('express-validator');

const userValidationMiddleware = [
    body('email').isEmail().withMessage('Ingrese un correo electrónico válido'),
    body('name').notEmpty().withMessage('El nombre no puede estar vacío'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
];

module.exports = { userValidationMiddleware };