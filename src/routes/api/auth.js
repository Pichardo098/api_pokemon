const express = require('express');
const router = express.Router();

const authController = require('../../controllers/auth-controller');

/**
 * @routePOST /api/v1/auth/login
 * @description Login user
 * @access Public
 */
router.post('/login', authController.login);

/**
 * @routePOST /api/v1/auth/register
 * @description Register user
 * @access Public
 */
router.post('/register', authController.register);

module.exports = router;
