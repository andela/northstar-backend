module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
    facility_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'facilities',
        key: 'id',
        as: 'facility_id'
      },
      onDelete: 'CASCADE'
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id',
        as: 'user_id'
      },
      onDelete: 'CASCADE'
    }
  }, {
    tableName: 'likes',
    underscored: true
  });
  Like.associate = () => {
    // associations can be defined here
    // removed the parameter "models" because it is not being used
  };
  return Like;
};
