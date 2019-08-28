require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER_DEVELOPMENT,
    password: process.env.DB_PASSWORD_DEVELOPMENT,
    database: process.env.DB_NAME_DEVELOPMENT,
    host: process.env.DB_HOST_DEVELOPMENT || 'localhost',
    dialect: process.env.DB_DIALECT || 'postgres'
  },
  staging: {
    username: process.env.DB_USER_STAGING,
    password: process.env.DB_PASSWORD_STAGING,
    database: process.env.DB_NAME_STAGING,
    host: process.env.DB_HOST_STAGING || 'localhost',
    dialect: process.env.DB_DIALECT || 'postgres'
  },
  production: {
    use_env_variable: process.env.DB_STRING_PRODUCTION,
    dialect: process.env.DB_DIALECT || 'postgres'
  }
};
