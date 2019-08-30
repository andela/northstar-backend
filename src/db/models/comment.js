module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    comment: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'comments',
    underscored: true
  });
  Comment.associate = (models) => {
    Comment.belongsTo(models.User, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE'
    });
    Comment.belongsTo(models.Request, {
      foreignKey: 'request_id',
      onDelete: 'CASCADE'
    });
  };
  return Comment;
};
