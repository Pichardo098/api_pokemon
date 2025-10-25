const express = require('express');
const router = express.Router();

// Import controllers
const pokemonController = require('../../controllers/pokemon-controller');

/**
 * @routeGET /api/v1/pokemon
 * @description Get all pokemons
 * @access Public
 */
router.get('/', pokemonController.getAllPokemons);

/**
 * @routeGET /api/v1/pokemon/:name or /api/v1/pokemon/:id
 * @description Get details of a pokemon
 * @access Public
 */
router.get('/details/', pokemonController.getDetailsPokemon);

/**
 * @routeGET /api/v1/pokemon/type/:type
 * @description Get pokemons by type
 * @access Public
 */
router.get('/type/:type', pokemonController.getPokemonsPerType);

/**
 * @routeGET /api/v1/pokemon/:pokemon/specie
 * @description Get specie of a pokemon
 * @access Public
 */
router.get('/specie/:pokemon', pokemonController.getSpecieByPokemon);

/**
 * @routeGET /api/v1/pokemon/:id/chain
 * @description Get evolution chain of a pokemon
 * @access Public
 */
router.get('/chain/:id', pokemonController.getChainByPokemon);

module.exports = router;
