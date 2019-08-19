
module.exports = (sequelize, DataTypes) => {
  const Department = sequelize.define('Department', {
    name: DataTypes.STRING
  }, {
    tableName: 'departments',
    underscored: true
  });
  Department.associate = (models) => {
    // associations can be defined here
    Department.belongsTo(models.User, {
      foreignKey: 'manager_id',
      constraints: false
    });
  };
  return Department;
};
