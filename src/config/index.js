require('dotenv').config({ path: '.env' });

const config = {
    errorMessages: {
        serverError: 'Ha ocurrido un error en el servidor.',
        forbidden: 'No tienes permisos para acceder a esta ruta.',
        notFound: 'La ruta solicitada no existe.',
        badRequest: 'La solicitud no es válida.',
        unauthorized: 'No estás autorizado para acceder a esta ruta.',
        forbidden: 'No tienes permisos para acceder a esta ruta.',
        notFound: 'La ruta solicitada no existe.',
        badRequest: 'La solicitud no es válida.',
        unauthorized: 'No estás autorizado para acceder a esta ruta.'
    },
    nodeenv: process.env.NODE_ENV,
    pokeApiUrl: process.env.POKE_API_URL,
    port: process.env.PORT,
    host: process.env.HOST,
    db: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        name: process.env.DB_NAME
    },
    redis: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD,
        ttl: process.env.CACHE_TTL
    },
    rateLimit: {
        windowMs: process.env.RATE_LIMIT_WINDOW_MS,
        max: process.env.RATE_LIMIT_MAX
    },
    database: {
        url: process.env.DATABASE_URL
    }
};

module.exports = config;
