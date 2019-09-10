module.exports = (sequelize, DataTypes) => {
  const Feedback = sequelize.define('Feedback', {
    feedback: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'feedbacks',
    underscored: true
  });
  Feedback.associate = (models) => {
    Feedback.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
      onDelete: 'CASCADE'
    });
    Feedback.belongsTo(models.Facility, {
      foreignKey: 'facility_id',
      onDelete: 'CASCADE'
    });
  };
  return Feedback;
};
