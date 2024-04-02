const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const File = sequelize.define('File', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false
        },
        url: {
            type: DataTypes.STRING,
            allowNull: true
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    return File;
}