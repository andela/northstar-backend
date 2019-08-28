module.exports = (sequelize, DataTypes) => {
  const Request = sequelize.define('Request', {
    category: {
      type: DataTypes.ENUM('one-way', 'round-trip', 'multi-city'),
      allowNull: false
    },
    origin: {
      type: DataTypes.STRING,
      allowNull: false
    },
    destination: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false
    },
    departure_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    return_date: {
      type: DataTypes.DATE // return date allows null because it could be a one-way-trip
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'declined', 'approved'),
      defaultValue: 'pending'
    }
  }, {
    tableName: 'requests',
    underscored: true
  });
  Request.associate = (models) => {
    // associations can be defined here
    Request.belongsTo(models.User, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE'
    });

    Request.belongsTo(models.Booking, {
      foreignKey: 'booking_id',
      onDelete: 'CASCADE'
    });
  };
  return Request;
};
