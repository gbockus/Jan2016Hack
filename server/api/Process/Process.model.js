'use strict';

exports['default'] =  function(sequelize, DataTypes) {
  return sequelize.define('Process', {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: DataTypes.STRING,
    info: DataTypes.STRING,
    active: DataTypes.BOOLEAN
  });
};
module.exports = exports['default'];
