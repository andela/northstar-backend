module.exports = (sequelize, DataTypes) => {
  const Feedback = sequelize.define('Feedback', {
    feedback: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'feedback',
    underscored: true
  });
  Feedback.associate = (models) => {
    Feedback.belongsTo(models.User, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE'
    });

    Feedback.belongsTo(models.Facility, {
      foreignKey: 'facility_id',
      onDelete: 'CASCADE'
    });
  };
  return Feedback;
};
