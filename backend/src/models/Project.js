const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Project = sequelize.define('Project', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    });

    return Project;
}