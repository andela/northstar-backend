module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
        as: 'user_id'
      },
      onDelete: 'CASCADE'
    },
    trip_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'trips',
        key: 'id',
        as: 'trip_id'
      },
      onDelete: 'CASCADE'
    },
    comment: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    replied_to: {
      type: DataTypes.INTEGER,
      references: {
        model: 'comments',
        key: 'id',
        as: 'replied_to'
      }
    }
  }, {
    tableName: 'comments',
    underscored: true
  });
  Comment.associate = () => {
    // associations can be defined here
    // The parameter "models" was removed because it is not in use
  };
  return Comment;
};
