module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define('Booking', {
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
    room_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'rooms',
        key: 'id',
        as: 'room_id'
      },
      onDelete: 'CASCADE'
    },
    arrival_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    departure_date: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'bookings',
    underscored: true
  });
  Booking.associate = () => {
    // associations can be defined here
  };
  return Booking;
};
