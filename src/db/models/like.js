module.exports = (sequelize, DataTypes) => {
  // remove DataTypes param because it is not being used
  const Like = sequelize.define('Like', {
    status: {
      type: DataTypes.BOOLEAN
    }
  }, {
    tableName: 'likes',
    underscored: true
  });
  Like.associate = (models) => {
    Like.belongsTo(models.User, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE'
    });
    Like.belongsTo(models.Facility, {
      foreignKey: 'facility_id',
      onDelete: 'CASCADE'
    });
  };

  return Like;
};
