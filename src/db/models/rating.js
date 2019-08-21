module.exports = (sequelize, DataTypes) => {
  const Rating = sequelize.define('Rating', {
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      }
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id',
        as: 'user_id'
      },
      onDelete: 'CASCADE'
    },
    facility_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'facilities',
        key: 'id',
        as: 'facility_id'
      },
      onDelete: 'CASCADE'
    }
  }, {
    tableName: 'ratings',
    underscored: true
  });

  Rating.associate = () => {
    // associations can be defined here
    // removed the parameter "models" because it is not being used
  };
  return Rating;
};
