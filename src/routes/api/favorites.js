const express = require('express');
const router = express.Router();

// Import controllers
const favoriteController = require('../../controllers/favorite-controller');

/**
 * @routePOST /api/v1/favorites
 * @description Add a pokemon to favorites
 * @access Public
 */
router.post('/', favoriteController.addFavorite);

/**
 * @routeGET /api/v1/favorites
 * @description Get all favorites
 * @access Public
 */
router.get('/:userId', favoriteController.getFavorites);

/**
 * @routeDELETE /api/v1/favorites
 * @description Remove a pokemon from favorites
 * @access Public´
 */
router.delete('/', favoriteController.removeFavorite);

module.exports = router;
