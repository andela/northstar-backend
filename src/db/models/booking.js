module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define('Booking', {
    departure_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    return_date: {
      type: DataTypes.DATEONLY,
    },
    checked_in: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'bookings',
    underscored: true
  });
  Booking.associate = (models) => {
    Booking.belongsTo(models.User, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE'
    });
    Booking.belongsTo(models.Room, {
      foreignKey: 'room_id',
      onDelete: 'CASCADE'
    });
    Booking.belongsTo(models.Facility, {
      foreignKey: 'facility_id',
      onDelete: 'CASCADE'
    });
  };
  return Booking;
};
