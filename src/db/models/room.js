module.exports = (sequelize, DataTypes) => {
  const Room = sequelize.define('Room', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false
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
    tableName: 'rooms',
    underscored: true
  });
  Room.associate = () => {
    // associations can be defined here
    // removed the parameter "models" because it is not being used
  };
  return Room;
};
