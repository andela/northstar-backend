module.exports = (sequelize, DataTypes) => {
  const Trip = sequelize.define('Trip', {
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
    category: {
      type: DataTypes.ENUM('one-way', 'round-trip', 'multi-city'),
      allowNull: false
    },
    from: {
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
    accommodation_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'bookings',
        key: 'id',
        as: 'accommodation_id'
      },
      onDelete: 'CASCADE'
    },
    status: {
      type: DataTypes.ENUM('pending', 'declined', 'approved'),
      defaultValue: 'pending'
    }
  }, {
    tableName: 'trips',
    underscored: true
  });
  Trip.associate = () => {
    // associations can be defined here
  };
  return Trip;
};
