/**
 * Filename: favorite-controller.js
 * Description: Controller for the favorites API.
 *
 * Author: Jesús Pichardo
 */

// ---------- Importing Models ---------- //
const Favorite = require('../models/favorite');

// ---------- Importing Utilities ---------- //
const config = require('../config');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { cache, invalidateCache } = require('../utils/redisCache');

// Controller to add a pokemon to favorites
exports.addFavorite = catchAsync(async (req, res, next) => {
    let { pokemon, userId } = req.body || {};

    if (!pokemon || !userId) return next(new AppError('Faltan campos', 400));

    // Check if the pokemon already exists in favorites
    const exists = await Favorite.findOne({ pokemon, user: userId, isActive: true });
    if (exists) return next(new AppError('El Pokémon ya está en favoritos', 409));

    const cachedFavoriteKey = `favorite:${pokemon}`;

    // Fetch Pokémon data (cache or API)
    const favoriteData = await cache(cachedFavoriteKey, async () => {
        const response = await fetch(`${config.pokeApiUrl}pokemon/${pokemon}/`);
        const responseData = await response.json();
        if (!response.ok) throw new AppError('Error al obtener el Pokémon', response.status);

        return {
            pokemon: responseData.name,
            pokemonId: responseData.id,
            isActive: true
        };
    });

    // Save to database
    const newFavorite = await Favorite.create({
        user: userId,
        pokemon: favoriteData.pokemon,
        pokemonId: favoriteData.pokemonId,
        isActive: true
    });

    // Invalidate general favorites cache for this user
    await invalidateCache(`favorites:${userId}`);

    return res.status(201).json({ message: 'Pokémon añadido a favoritos', favorite: newFavorite });
});

// Controller to get all favorites
exports.getFavorites = catchAsync(async (req, res, next) => {
    const { id: userId } = req.user || {};
    if (!userId) return next(new AppError('Usuario no autenticado', 401));

    const cachedFavoritesKey = `favorites:${userId}`;

    // Fetch favorites from cache or DB
    const favorites = await cache(cachedFavoritesKey, async () => {
        const favs = await Favorite.find({ user: userId, isActive: true }).select('-__v');
        return favs;
    });

    return res.status(200).json(favorites);
});

// Controller to remove a pokemon from favorites
exports.removeFavorite = catchAsync(async (req, res, next) => {
    const { pokemonId, userId } = req.body || {};
    if (!pokemonId || !userId) return next(new AppError('Faltan campos', 400));

    const favorite = await Favorite.findOneAndUpdate({ user: userId, pokemonId }, { isActive: false }, { new: true });

    if (!favorite) return next(new AppError('Favorito no encontrado', 404));

    // Invalidate caches
    await invalidateCache(`favorite:${favorite.pokemon}`);
    await invalidateCache(`favorites:${userId}`);

    return res.status(200).json({ message: 'Pokémon eliminado de favoritos' });
});
