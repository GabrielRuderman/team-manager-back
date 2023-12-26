const express = require('express');
const router = express.Router();
const { userValidationMiddleware } = require('../middlewares/userValidationMiddleware');
const userController = require('../controllers/userController');

router.get('/recoverPassword', userController.recoverPassword);
router.post('/createUser', userValidationMiddleware, userController.createUser);
router.post('/validateCredentials', userController.validateCredentials);
router.post('/validateToken', userController.validateToken);

module.exports = router;