module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    trip_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'trips',
        key: 'id',
        as: 'trip_id'
      },
      onDelete: 'CASCADE'
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false
    },
    notification: {
      type: DataTypes.STRING,
      allowNull: false
    },
    receiver_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
        as: 'receiver_id'
      },
      onDelete: 'CASCADE'
    },
    read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'notifications',
    underscored: true
  });
  Notification.associate = () => {
    // associations can be defined here
    // removed the parameter "models" because it is not being used
  };
  return Notification;
};
