const { Sequelize } = require('sequelize');
const pg = require('pg');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectModule: pg,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
    pool: { max: 2, min: 0, idle: 10000, acquire: 30000 },
    logging: false
});

module.exports = sequelize;