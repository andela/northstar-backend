module.exports = (sequelize, DataTypes) => {
  const Feedback = sequelize.define('Feedback', {
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
    feedback: {
      type: DataTypes.STRING,
      allowNull: false
    },
    facility_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'facilities',
        key: 'id',
        as: 'facility_id'
      },
      onDelete: 'CASCADE'
    }
  }, {
    tableName: 'feedback',
    underscored: true
  });
  Feedback.associate = () => {
    // associations can be defined here
    // The parameter "models" was removed because it is not in use
  };
  return Feedback;
};
