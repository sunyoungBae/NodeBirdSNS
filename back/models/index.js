'use strict';

const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];  // config/config.json > development 객체
const db = {};

// sequelize가 mysql2를 사용해 node와 MySQL을 연결시켜준다.
const sequelize = new Sequelize(config.database, config.username, config.password, config);

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
