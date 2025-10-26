/**
 * Filename: auth-controller.js
 * Description: Controller for the auth API.
 *
 * Author: Jesús Pichardo
 */

// ---------- Importing Models ---------- //
const User = require('../models/user');

// ---------- Importing Utilities ---------- //
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { cache, invalidateCache } = require('../utils/redisCache');
const config = require('../config');

// Controller to register a new user
exports.register = catchAsync(async (req, res, next) => {
  let { username, password } = req.body || {};
  if (!username || !password) return next(new AppError('Faltan campos', 400));

  username = username.toUpperCase().trim();

  // Cache hey (unique username)
  const cachedUser = `user_exists:${username}`;

  // User redis cache
  const existingUser = await cache(cachedUser, async () => {
    const existingUser = await User.findOne({ username });
    return existingUser ? true : false;
  });

  // Check if the username is already taken
  if (existingUser) return next(new AppError('El usuario ya existe', 409));

  // Create and save a new user instance
  const newUser = new User();
  await newUser.saveUser(username, password);

  // Invalidate cache
  await invalidateCache(cachedUser);

  const user = await User.findOne({
    username: new RegExp(`^${username}$`, 'i'),
  });

  return res
    .status(201)
    .json({
      message: 'Usuario creado',
      user: { username: user.username, _id: user._id },
    });
});

// Controller to login a user
exports.login = catchAsync(async (req, res, next) => {
  let { username, password } = req.body || {};

  if (!username || !password) return next(new AppError('Faltan campos', 400));

  username = username.toUpperCase();

  // Cache hey (unique username)
  const cachedUser = `user_auth:${username}`;

  // Try getting he user from cache
  let user = await cache(cachedUser, async () => {
    // Fetch from DB if not in cache
    const dbUser = await User.findOne({
      username: new RegExp(`^${username}$`, 'i'),
    });
    if (!dbUser) return next(new AppError('Usuario no encontrado', 404));

    return {
      username: dbUser.username,
      _id: dbUser._id,
    };
  });

  // Find the user by username
  const userFull = await User.findOne({
    username: new RegExp(`^${username}$`, 'i'),
  });

  // Check if the password matches
  if (!userFull.validPassword(password))
    return next(new AppError('Usuario o contraseña incorrectos', 401));

  const message = {
    message: 'Usuario autenticado',
    user,
  };

  return res.status(200).json(message);
});
