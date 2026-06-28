const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
    // Pool reducido: en serverless cada instancia abre pocas conexiones
    pool: { max: 2, min: 0, idle: 10000, acquire: 30000 },
    logging: false
});

module.exports = sequelize;