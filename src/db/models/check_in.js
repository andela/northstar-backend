module.exports = (sequelize, DataTypes) => {
  const Check_in = sequelize.define('Check_in', {
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    tableName: 'check_ins',
    underscored: true
  });
  Check_in.associate = (models) => {
    // associations can be defined here
    Check_in.belongsTo(models.User, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE'
    });
    Check_in.belongsTo(models.Facility, {
      foreignKey: 'facility_id',
      onDelete: 'CASCADE'
    });
  };
  return Check_in;
};
