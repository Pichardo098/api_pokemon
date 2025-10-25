/**
 * Filename: pokemon-controller.js
 * Description: Controller for the pokemon API.
 *
 * Author: Jesús Pichardo
 */

const config = require('../config');
const POKE_API_URL = config.pokeApiUrl;

// ---------- Importing Utilities ---------- //
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { cache, invalidateCache } = require('../utils/redisCache');

// Controller to ger all pokemons
exports.getAllPokemons = catchAsync(async (req, res, next) => {
    const cachedPokemons = 'pokemons';

    // Try getting he user from cache
    let pokemons = await cache(cachedPokemons, async () => {
        const response = await fetch(`${POKE_API_URL}pokemon/?limit=1328`, {
            method: 'GET'
        });

        const reponseData = await response.json();
        const status = response.status;
        if (!status.toString().startsWith('2')) {
            throw new AppError('Error al obtener los pokemons', status);
        }
        const sortedPokemons = reponseData.results.sort((a, b) => a.name - b.name);
        return { ...reponseData, results: sortedPokemons };
    });

    return res.status(200).json(pokemons);
});

// Controller to get details of a pokemon
exports.getDetailsPokemon = catchAsync(async (req, res, next) => {
    let { query } = req.query || {};

    if (!query) return next(new AppError('Es necesaio un nombre o un id', 400));

    const cachedPokemon = `pokemon:${query}`;

    // Try getting he user from cache
    let pokemon = await cache(cachedPokemon, async () => {
        const response = await fetch(`${POKE_API_URL}pokemon/${query}/`, {
            method: 'GET'
        });

        const reponseData = await response.json();
        const status = response.status;
        if (!status.toString().startsWith('2')) {
            throw new AppError('Error al obtener el pokemon', status);
        }
        return reponseData;
    });

    return res.status(200).json(pokemon);
});

// Controller to ger pokemons by type
exports.getPokemonsPerType = catchAsync(async (req, res, next) => {
    let { type } = req.params || {};

    const types = [
        'normal',
        'fire',
        'water',
        'electric',
        'grass',
        'ice',
        'fighting',
        'poison',
        'ground',
        'flying',
        'psychic',
        'bug',
        'rock',
        'ghost',
        'dragon',
        'dark',
        'steel',
        'fairy'
    ];

    if (!types.includes(type)) type = 'unknown';

    const cachedPokemons = `pokemons:${type}`;

    // Try getting he user from cache
    let pokemons = await cache(cachedPokemons, async () => {
        const response = await fetch(`${POKE_API_URL}type/${type}`, {
            method: 'GET'
        });

        const responseData = await response.json();
        const status = response.status;
        if (!status.toString().startsWith('2')) {
            throw new AppError('Error al obtener los pokemons', status);
        }
        const pokemon_names = responseData.pokemon.map((item) => item.pokemon.name);
        return pokemon_names;
    });

    return res.status(200).json({ pokemons });
});

exports.getSpecieByPokemon = catchAsync(async (req, res, next) => {
    let { pokemon } = req.params || {};

    const cachedPokemons = `species:${pokemon}`;

    // Try getting he user from cache
    let specieData = await cache(cachedPokemons, async () => {
        const response = await fetch(`${POKE_API_URL}pokemon-species/${pokemon}/`, {
            method: 'GET'
        });

        const responseData = await response.json();
        const status = response.status;
        if (!status.toString().startsWith('2')) {
            throw new AppError('Error al obtener los pokemons', status);
        }

        const url = responseData.evolution_chain?.url;
        // Extract only relevant info
        return {
            name: responseData.name,
            color: responseData.color?.name,
            habitat: responseData.habitat?.name,
            generation: responseData.generation?.name,
            evolution_chain_url: url,
            evolution_chain_id: url ? url.split('/').filter(Boolean).pop() : null
        };
    });

    return res.status(200).json(specieData);
});

// Controller to get evolution chain
exports.getChainByPokemon = catchAsync(async (req, res, next) => {
    let { id } = req.params || {};

    const cachedKey = `evolution:${id}`;

    const chainData = await cache(cachedKey, async () => {
        const response = await fetch(`${POKE_API_URL}evolution-chain/${id}/`, {
            method: 'GET'
        });

        const responseData = await response.json();
        const status = response.status;

        if (!status.toString().startsWith('2')) {
            throw new AppError('Error al obtener la cadena evolutiva', status);
        }

        // Recursive function to extract all species in the evolution chain
        const extractChain = (chain) => {
            const evo = [];
            let current = chain;

            while (current) {
                evo.push(current.species.name);
                current = current.evolves_to?.[0];
            }

            return evo;
        };

        return {
            id: responseData.id,
            chain: extractChain(responseData.chain)
        };
    });

    return res.status(200).json(chainData);
});
