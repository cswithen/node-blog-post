/**
 * @file
 * This file will
 * - In Production: Pull the keys values out of envs as used by Heroku envs.
 * - In Development: Pull the keys values defined in the .env root of the project for development.
 */

require('dotenv').config()

if (process.env.NODE_ENV === 'ci') {
  module.exports = {
    googleClientID: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    mongoURI: 'mongodb://127.0.0.1:27017/blogs_ci',
    cookieKey: process.env.COOKIE_KEY,
    redisUrl: process.env.redusUrl
  }
} else {
  module.exports = {
    googleClientID: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    mongoURI: process.env.MONGODB_URI,
    cookieKey: process.env.COOKIE_KEY,
    port: process.env.PORT,
    redisUrl: process.env.redusUrl
  }
}
