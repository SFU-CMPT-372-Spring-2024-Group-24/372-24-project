const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const UserProject = sequelize.define('UserProject', {
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  return UserProject;
}