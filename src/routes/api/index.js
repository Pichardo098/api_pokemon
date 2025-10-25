const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth'));
router.use('/favorites', require('./favorites'));
router.use('/pokemon', require('./pokemon'));

module.exports = router;
