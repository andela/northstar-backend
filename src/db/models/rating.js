module.exports = (sequelize, DataTypes) => {
  const Rating = sequelize.define('Rating', {
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      }
    }
  }, {
    tableName: 'ratings',
    underscored: true
  });

  Rating.associate = (models) => {
    // associations can be defined here
    Rating.belongsTo(models.User, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE'
    });

    Rating.belongsTo(models.Facility, {
      foreignKey: 'facility_id',
      onDelete: 'CASCADE'
    });
  };
  return Rating;
};
