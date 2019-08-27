module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    subject: {
      type: DataTypes.STRING,
      allowNull: false
    },
    notification: {
      type: DataTypes.STRING,
      allowNull: false
    },
    read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'notifications',
    underscored: true
  });

  Notification.associate = (models) => {
    // associations can be defined here
    Notification.belongsTo(models.Request, {
      foreignKey: 'request_id',
      onDelete: 'CASCADE'
    });

    Notification.belongsTo(models.User, {
      foreignKey: 'receiver_id',
      onDelete: 'CASCADE'
    });
    // removed the parameter "models" because it is not being used
  };
  return Notification;
};
